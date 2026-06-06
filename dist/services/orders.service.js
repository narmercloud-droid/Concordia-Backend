import { prisma } from "../prisma/client.js";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { randomUUID } from "crypto";
import { OrderLifecycleService } from "./order/orderLifecycle.service.js";
import logger from "../logger.js";
function buildOrderItems(items) {
    return items.map(i => {
        const itemId = i.itemId ?? i.product_id ?? i.item_id ?? i.item?.id;
        return {
            id: randomUUID(),
            quantity: i.quantity ?? i.qty ?? 1,
            notes: i.notes ?? i.note ?? null,
            price: i.price ?? i.unit_price ?? 0,
            variantId: i.variantId ?? i.variant_id ?? itemId ?? randomUUID(),
            addOnIds: i.addOnIds ?? i.add_on_ids ?? [],
            item: {
                connect: { id: itemId }
            }
        };
    });
}
const COURIER_TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
export class OrdersService {
    async createOrder(data) {
        const { items, ...rest } = data;
        if (!items || !Array.isArray(items)) {
            throw new Error("Order must include an items array");
        }
        const orderFields = {
            branchId: rest.branchId,
            customerId: rest.customerId,
            paymentMethod: rest.paymentMethod,
            isGuest: rest.isGuest,
            courierStatus: rest.courierStatus,
            courierToken: rest.courierToken,
            courierTokenExpiresAt: rest.courierTokenExpiresAt,
            paymentIntentId: rest.paymentIntentId,
            paymentStatus: rest.paymentStatus,
            paypalCaptureId: rest.paypalCaptureId,
            paypalOrderId: rest.paypalOrderId,
            scheduledFor: rest.scheduledFor,
            courierId: rest.courierId,
            externalAmount: rest.externalAmount,
            paidAt: rest.paidAt,
            terminal_id: rest.terminal_id,
            transactionId: rest.transactionId,
            walletUsed: rest.walletUsed,
            status: rest.status,
            tracking_token: rest.tracking_token
        };
        const filteredOrderData = Object.fromEntries(Object.entries(orderFields).filter(([, value]) => value !== undefined));
        const createPayload = {
            id: randomUUID(),
            ...filteredOrderData,
            tracking_token: filteredOrderData.tracking_token ?? crypto.randomUUID(),
            items: {
                create: buildOrderItems(items)
            }
        };
        logger.debug({ payload: createPayload }, 'PRISMA_CREATE_PAYLOAD');
        const order = await prisma.order.create({
            data: createPayload,
            include: { items: true }
        });
        return order;
    }
    async listBranchOrders(branchId) {
        return prisma.order.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
            include: { items: true }
        });
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
