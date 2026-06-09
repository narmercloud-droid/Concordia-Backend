import { prisma } from "../prisma/client.js";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { randomUUID } from "crypto";
import { OrderLifecycleService } from "./order/orderLifecycle.service.js";
import { validateDeliveryOrder } from "./customer/deliveryValidation.service.js";
import { validateScheduledTime } from "./scheduling/scheduling.service.js";
import { broadcastToTerminal } from "./realtime/realtime.service.js";
import { routeOrderToKitchens } from "./printer/kitchenRouting.service.js";
import { env } from "../config/env.js";
import logger from "../logger.js";
import { geocodeAddress } from "./geo/geocode.service.js";
import { getGuestCourierId } from "./branch/branchCoords.service.js";
import { calcWebsiteDiscount } from "../config/websitePromo.js";
function buildOrderItems(items) {
    return items.map((i) => {
        const itemId = Number(i.itemId ?? i.product_id ?? i.item_id ?? i.item?.id ?? i.id);
        const orderItemId = randomUUID();
        const variantSelections = i.variants ?? i.variantSelections ?? [];
        const addOnSelections = i.addOns ?? i.extras ?? [];
        const primaryVariantId = i.variantId ??
            i.variant_id ??
            (variantSelections[0]?.id ? String(variantSelections[0].id) : String(itemId));
        const addOnIds = (i.addOnIds ??
            i.add_on_ids ??
            addOnSelections.map((a) => a.id).filter(Boolean));
        const variantCreates = variantSelections
            .filter((v) => v?.name)
            .map((v) => ({
            name: v.name,
            price: Number(v.price ?? 0)
        }));
        const extraCreates = addOnSelections
            .filter((a) => a?.name)
            .map((a) => ({
            name: a.name,
            price: Number(a.price ?? 0)
        }));
        return {
            id: orderItemId,
            quantity: i.quantity ?? i.qty ?? 1,
            notes: i.notes ?? i.note ?? null,
            price: i.price ?? i.unit_price ?? 0,
            variantId: String(primaryVariantId),
            addOnIds,
            item: { connect: { id: itemId } },
            ...(variantCreates.length
                ? { variants: { create: variantCreates } }
                : {}),
            ...(extraCreates.length ? { extras: { create: extraCreates } } : {})
        };
    });
}
const COURIER_TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000;
function normalizePaymentMethod(method) {
    const value = (method ?? "cash").toLowerCase();
    if (value === "cash" || value === "cod")
        return "COD";
    return method ?? "COD";
}
function buildCourierUrl(token) {
    const base = env.FRONTEND_URL ?? "http://localhost:5173";
    return `${base}/courier/order?token=${token}`;
}
function enrichOrder(order) {
    return {
        ...order,
        courierUrl: order.courierToken ? buildCourierUrl(order.courierToken) : null
    };
}
export class OrdersService {
    async createOrder(data) {
        const { items, ...rest } = data;
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("Order must include at least one item");
        }
        if (!rest.branchId) {
            throw new Error("branchId is required");
        }
        const fulfillmentType = rest.fulfillmentType ?? rest.orderType ?? "delivery";
        const customerName = rest.customerName?.trim();
        const customerPhone = rest.customerPhone?.trim();
        const deliveryAddress = rest.deliveryAddress?.trim() ?? rest.address?.trim();
        let notes = rest.notes?.trim() ?? "";
        if (!customerName)
            throw new Error("Customer name is required");
        if (!customerPhone)
            throw new Error("Phone number is required");
        if (fulfillmentType === "delivery" && !deliveryAddress) {
            throw new Error("Delivery address is required");
        }
        let scheduledFor = null;
        if (rest.scheduledFor) {
            scheduledFor = new Date(rest.scheduledFor);
            if (Number.isNaN(scheduledFor.getTime())) {
                throw new Error("Invalid scheduled time");
            }
            const valid = await validateScheduledTime(rest.branchId, scheduledFor);
            if (!valid) {
                throw new Error("Scheduled time must be during opening hours and in the future");
            }
        }
        const subtotal = items.reduce((sum, item) => sum + Number(item.price ?? item.unit_price ?? 0) * Number(item.quantity ?? item.qty ?? 1), 0);
        const websiteDiscount = calcWebsiteDiscount(subtotal);
        const discountedSubtotal = Math.max(0, subtotal - websiteDiscount);
        const branchConfig = await prisma.branchConfig.findUnique({
            where: { branchId: rest.branchId }
        });
        const config = (branchConfig?.configJson ?? {});
        const promotions = (config.promotions ?? {});
        const freeDrinkMin = Number(promotions.freeDrinkMinOrder ?? 0);
        if (freeDrinkMin > 0 && subtotal >= freeDrinkMin) {
            const promoLine = "[PROMO] Kunde hat Anspruch auf 1 gratis Getränk (Flyer-Aktion).";
            notes = notes ? `${notes}\n${promoLine}` : promoLine;
        }
        if (websiteDiscount > 0) {
            const discountLine = `[PROMO] 10% Online-Rabatt (-${websiteDiscount.toFixed(2)} €)`;
            notes = notes ? `${notes}\n${discountLine}` : discountLine;
        }
        let deliveryFee = 0;
        let postalCode = rest.postalCode ?? null;
        if (fulfillmentType === "delivery") {
            const validation = await validateDeliveryOrder(rest.branchId, deliveryAddress, subtotal);
            deliveryFee = validation.deliveryFee;
            postalCode = validation.postalCode;
        }
        const trackingToken = rest.tracking_token ?? crypto.randomUUID();
        const isDelivery = fulfillmentType === "delivery";
        let courierToken;
        let courierTokenExpiresAt;
        let deliveryLat = null;
        let deliveryLng = null;
        let courierId = null;
        if (isDelivery) {
            courierToken = uuid();
            courierTokenExpiresAt = new Date(Date.now() + COURIER_TOKEN_VALIDITY_MS);
            courierId = await getGuestCourierId(rest.branchId);
            const geo = await geocodeAddress(deliveryAddress);
            if (geo) {
                deliveryLat = geo.lat;
                deliveryLng = geo.lng;
            }
        }
        const createPayload = {
            id: randomUUID(),
            branchId: rest.branchId,
            customerId: rest.customerId,
            customerName,
            customerPhone,
            deliveryAddress: isDelivery ? deliveryAddress : null,
            fulfillmentType,
            postalCode,
            notes: notes || null,
            orderTotal: discountedSubtotal + deliveryFee,
            discount: websiteDiscount,
            deliveryFee,
            scheduledFor,
            paymentMethod: normalizePaymentMethod(rest.paymentMethod),
            isGuest: rest.isGuest ?? true,
            courierStatus: isDelivery ? "pending" : null,
            courierId,
            courierToken,
            courierTokenExpiresAt,
            deliveryLat,
            deliveryLng,
            paymentStatus: rest.paymentStatus ?? "pending",
            status: "pending",
            tracking_token: trackingToken,
            items: {
                create: buildOrderItems(items)
            }
        };
        logger.debug({ branchId: rest.branchId, fulfillmentType, scheduledFor }, "Creating order");
        const order = await prisma.order.create({
            data: createPayload,
            include: {
                items: {
                    include: { item: true }
                }
            }
        });
        await prisma.orderTrackingEvent.create({
            data: {
                id: randomUUID(),
                orderId: order.id,
                status: "pending",
                timestamp: new Date()
            }
        });
        const payload = enrichOrder(order);
        broadcastToTerminal(order.branchId, "order:new", payload);
        return payload;
    }
    async confirmOrderWithPrepTime(orderId, prepMinutes) {
        if (!Number.isFinite(prepMinutes) || prepMinutes < 5 || prepMinutes > 180) {
            throw new Error("Prep time must be between 5 and 180 minutes");
        }
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { item: true } }
            }
        });
        if (!order)
            throw new Error("Order not found");
        if (order.status !== "pending") {
            throw new Error("Order has already been confirmed");
        }
        const etaReadyAt = new Date(Date.now() + prepMinutes * 60000);
        const updated = await OrderLifecycleService.updateStatus(orderId, "accepted", undefined, {
            estimatedPrepTime: prepMinutes,
            estimatedTotalTime: prepMinutes,
            etaReadyAt,
            confirmedAt: new Date()
        });
        await routeOrderToKitchens(orderId);
        const fullOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { item: true } } }
        });
        const payload = enrichOrder(fullOrder);
        broadcastToTerminal(order.branchId, "order:confirmed", payload);
        return payload;
    }
    async listBranchOrders(branchId) {
        return prisma.order.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { item: true }
                }
            }
        });
    }
    async getOrderStatus(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                trackingEvents: { orderBy: { timestamp: "asc" } }
            }
        });
        if (!order) {
            throw new Error("Order not found");
        }
        const latestLocation = await prisma.courierLocation.findFirst({
            where: { orderId: order.id },
            orderBy: { createdAt: "desc" }
        });
        const timeline = order.trackingEvents?.length
            ? order.trackingEvents.map((event) => ({
                status: event.status,
                timestamp: event.timestamp
            }))
            : [{ status: order.status, timestamp: order.updatedAt }];
        return {
            id: order.id,
            status: order.status,
            courierStatus: order.courierStatus,
            fulfillmentType: order.fulfillmentType,
            scheduledFor: order.scheduledFor,
            estimatedPrepTime: order.estimatedPrepTime,
            etaReadyAt: order.etaReadyAt,
            trackingToken: order.tracking_token,
            deliveryAddress: order.deliveryAddress,
            deliveryLat: order.deliveryLat,
            deliveryLng: order.deliveryLng,
            driverAccepted: !!order.driverAcceptedAt,
            courierLocation: latestLocation
                ? {
                    lat: latestLocation.latitude,
                    lng: latestLocation.longitude,
                    updatedAt: latestLocation.createdAt
                }
                : null,
            timeline
        };
    }
    async updateStatus(orderId, status) {
        return OrderLifecycleService.updateStatus(orderId, status);
    }
    async generateCourierToken(orderId) {
        const token = uuid();
        const expiresAt = new Date(Date.now() + COURIER_TOKEN_VALIDITY_MS);
        return OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
    }
    async listCustomerOrders(customerId) {
        return prisma.order.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
            include: { items: true }
        });
    }
    async validateCourierToken(orderId, token) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return null;
        if (order.courierToken !== token)
            return null;
        if (!order.courierTokenExpiresAt)
            return null;
        if (order.courierTokenExpiresAt < new Date())
            return null;
        return order;
    }
    async courierPickedUp(orderId) {
        return OrderLifecycleService.updateStatus(orderId, "picked_up", undefined, {
            courierStatus: "picked_up"
        });
    }
    async courierDelivered(orderId) {
        const updatedOrder = await OrderLifecycleService.updateStatus(orderId, "delivered", undefined, {
            courierStatus: "delivered"
        });
        if (updatedOrder.customerId) {
            const points = Math.floor((updatedOrder.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) / 10);
            if (points > 0) {
                await prisma.customer.update({
                    where: { id: updatedOrder.customerId },
                    data: { loyaltyPoints: { increment: points } }
                });
            }
        }
        return updatedOrder;
    }
}
export const ordersService = new OrdersService();
