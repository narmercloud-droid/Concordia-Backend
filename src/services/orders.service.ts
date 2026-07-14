import { prisma } from "../prisma/client.ts";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { randomUUID } from "crypto";
import { OrderLifecycleService } from "./order/orderLifecycle.service.ts";
import { validateDeliveryOrder } from "./customer/deliveryValidation.service.ts";
import { validateScheduledTime, isBranchOpenNow } from "./scheduling/scheduling.service.ts";
import { broadcastToTerminal } from "./realtime/realtime.service.ts";
import { routeOrderToKitchens } from "./printer/kitchenRouting.service.ts";
import { env } from "../config/env.ts";
import logger from "../logger.ts";
import { geocodeAddress } from "./geo/geocode.service.ts";
import { getGuestCourierId } from "./branch/branchCoords.service.ts";
import { calcWebsiteDiscount, getWebsiteOrderDiscountPct, isFreeDrinkPromoActive } from "../config/websitePromo.ts";
import { redeemPromoCode } from "./customer/promoCode.service.ts";
import { validateDiscountCode } from "./customer/discountCode.service.ts";
import { redeemCustomerCoupon } from "./customer/customerCoupon.service.ts";
import { redeemGiftCard } from "./customer/giftCard.service.ts";
import {
  findFreeDrinkOption,
  getFreeDrinkOptions
} from "./customer/freeDrink.service.ts";
import {
  isFirstBranchOrder,
  syncBranchCustomerFromOrder
} from "./customer/branchCustomer.service.ts";
import { persistPushSubscriptionFromOrder } from "./notifications/webPushSubscription.service.ts";
import { buildCourierUrl, buildOrderReviewUrl, buildOrderTrackingUrl } from "../utils/customerOrderUrls.ts";
import { fail } from "../contracts/api.js";
import {
  validateAndPriceOrderLines,
  type PricedOrderLine
} from "./customer/orderPricing.service.ts";
import { sendOrderConfirmationEmail } from "./customer/orderConfirmationEmail.service.ts";
import {
  cancelReasonToTrackingStatus,
  isKitchenReadyOrder,
  isUnpaidOnlineOrder,
  normalizePaymentMethod,
  requiresOnlinePayment
} from "../utils/orderPayment.ts";

const ORDER_ITEMS_INCLUDE = {
  item: true,
  variants: true,
  extras: true
} as const;

function buildOrderItems(pricedLines: PricedOrderLine[]) {
  return pricedLines.map((line) => {
    const orderItemId = randomUUID();
    const variantCreates = line.variants
      .filter((v) => v?.name)
      .map((v) => ({
        name: v.name,
        price: Number(v.price ?? 0)
      }));
    const extraCreates = line.addOns.map((a) => ({
      name: a.name,
      price: Number(a.price ?? 0)
    }));

    return {
      id: orderItemId,
      quantity: line.quantity,
      notes: line.notes,
      price: line.unitPrice,
      variantId: line.variantId,
      addOnIds: line.addOnIds,
      item: { connect: { id: line.itemId } },
      ...(variantCreates.length ? { variants: { create: variantCreates } } : {}),
      ...(extraCreates.length ? { extras: { create: extraCreates } } : {})
    };
  });
}

const COURIER_TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000;

function enrichOrder(order: any) {
  return {
    ...order,
    courierUrl: order.courierToken ? buildCourierUrl(order.courierToken) : null
  };
}

export class OrdersService {
  async createOrder(data: any) {
    const { items, ...rest } = data;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must include at least one item");
    }
    if (!rest.branchId) {
      throw new Error("branchId is required");
    }

    const branchConfig = await prisma.branchConfig.findUnique({
      where: { branchId: rest.branchId }
    });
    const branchConfigJson = (branchConfig?.configJson as Record<string, unknown> | null) ?? {};
    const branchStatus = String(branchConfigJson.status ?? "live");
    if (branchStatus === "coming_soon") {
      throw new Error("This branch is not accepting orders yet");
    }
    if (Boolean(branchConfigJson.ordersPaused)) {
      throw new Error("This branch is temporarily not accepting new orders");
    }

    const fulfillmentType = rest.fulfillmentType ?? rest.orderType ?? "delivery";
    const customerName = rest.customerName?.trim();
    const customerPhone = rest.customerPhone?.trim();
    const deliveryAddress = rest.deliveryAddress?.trim() ?? rest.address?.trim();
    let notes = rest.notes?.trim() ?? "";

    if (!customerName) throw new Error("Customer name is required");
    if (!customerPhone) throw new Error("Phone number is required");
    if (!rest.termsAccepted) {
      throw new Error("Bitte AGB und Widerrufsbelehrung akzeptieren");
    }

    if (fulfillmentType === "delivery" && !deliveryAddress) {
      throw new Error("Delivery address is required");
    }

    let scheduledFor: Date | null = null;
    if (rest.scheduledFor) {
      scheduledFor = new Date(rest.scheduledFor);
      if (Number.isNaN(scheduledFor.getTime())) {
        throw new Error("Invalid scheduled time");
      }
      const valid = await validateScheduledTime(rest.branchId, scheduledFor);
      if (!valid) {
        throw new Error("Scheduled time must be during opening hours and in the future");
      }
    } else {
      const openNow = await isBranchOpenNow(rest.branchId);
      if (!openNow) {
        throw new Error(
          "This branch is currently closed. Please schedule your order for an opening time."
        );
      }
    }

    const { pricedLines, subtotal } = await validateAndPriceOrderLines(rest.branchId, items);
    const promotions = (branchConfigJson.promotions ?? {}) as Record<string, unknown>;
    let websiteDiscount = calcWebsiteDiscount(subtotal, promotions);

    let promoDiscount = 0;
    let promoCodeId: string | null = null;
    let giftCardId: string | null = null;
    let giftCardAmount = 0;
    let customerCouponId: string | null = null;
    let couponFreeDelivery = false;
    let couponTitle: string | null = null;
    const customerId = rest.customerId?.trim() || null;
    const promoCodeInput = String(rest.promoCode ?? "").trim();
    const customerCouponIdInput = String(rest.customerCouponId ?? "").trim();

    if (customerCouponIdInput && customerId) {
      const discount = await validateDiscountCode(rest.branchId, "", subtotal, {
        customerId,
        customerCouponId: customerCouponIdInput
      });
      if (discount.kind === "customer_coupon") {
        websiteDiscount = 0;
        promoDiscount = discount.discountAmount;
        customerCouponId = discount.customerCouponId ?? customerCouponIdInput;
        couponFreeDelivery = Boolean(discount.freeDelivery);
        couponTitle = discount.title ?? null;
      }
    } else if (promoCodeInput) {
      const discount = await validateDiscountCode(rest.branchId, promoCodeInput, subtotal, {
        customerId
      });
      websiteDiscount = 0;
      promoDiscount = discount.discountAmount;
      if (discount.kind === "promo") {
        promoCodeId = discount.promoCodeId ?? null;
      } else if (discount.kind === "customer_coupon") {
        customerCouponId = discount.customerCouponId ?? null;
        couponFreeDelivery = Boolean(discount.freeDelivery);
        couponTitle = discount.title ?? null;
      } else {
        giftCardId = discount.giftCardId ?? null;
        giftCardAmount = discount.discountAmount;
      }
    }

    const totalDiscount = websiteDiscount + promoDiscount;
    const discountedSubtotal = Math.max(0, subtotal - totalDiscount);

    const config = (branchConfig?.configJson ?? {}) as Record<string, unknown>;
    const qualifiesForFreeDrink = isFreeDrinkPromoActive(promotions, subtotal);
    let freeDrinkChoice: string | null = null;

    if (qualifiesForFreeDrink) {
      const drinkOptions = await getFreeDrinkOptions(rest.branchId);
      const selected = findFreeDrinkOption(drinkOptions, rest.freeDrinkChoice);
      if (!selected) {
        throw new Error("Bitte wählen Sie Ihr Gratisgetränk aus");
      }
      freeDrinkChoice = selected.label;
      const promoLine = `[GRATISGETRÄNK] ${selected.label}`;
      notes = notes ? `${notes}\n${promoLine}` : promoLine;
    }

    if (websiteDiscount > 0) {
      const pct = getWebsiteOrderDiscountPct();
      const discountLine = `[PROMO] ${pct}% Online-Rabatt (-${websiteDiscount.toFixed(2)} €)`;
      notes = notes ? `${notes}\n${discountLine}` : discountLine;
    }

    const firstOrder = await isFirstBranchOrder(
      rest.branchId,
      customerPhone,
      rest.customerId
    );
    if (firstOrder) {
      const welcomeLine =
        "[ERSTBESTELLUNG] Willkommen! Vielen Dank für Ihre erste Bestellung bei uns!";
      notes = notes ? `${notes}\n${welcomeLine}` : welcomeLine;
    }

    if (promoDiscount > 0 && (promoCodeInput || couponTitle)) {
      const label = couponTitle ?? promoCodeInput.toUpperCase();
      const voucherLine = `[GUTSCHEIN] ${label} (-${promoDiscount.toFixed(2)} €)`;
      notes = notes ? `${notes}\n${voucherLine}` : voucherLine;
    }

    let deliveryFee = 0;
    let postalCode: string | null = rest.postalCode ?? null;

    if (fulfillmentType === "delivery") {
      const deliveryLat = Number(rest.deliveryLat);
      const deliveryLng = Number(rest.deliveryLng);
      const validation = await validateDeliveryOrder(rest.branchId, deliveryAddress, subtotal, {
        postalCode: rest.postalCode?.trim() || undefined,
        lat: Number.isFinite(deliveryLat) ? deliveryLat : undefined,
        lng: Number.isFinite(deliveryLng) ? deliveryLng : undefined
      });
      deliveryFee = validation.deliveryFee;
      postalCode = validation.postalCode;
    }

    if (couponFreeDelivery && fulfillmentType === "delivery") {
      deliveryFee = 0;
    }

    const trackingToken = rest.tracking_token ?? crypto.randomUUID();
    const isDelivery = fulfillmentType === "delivery";

    let courierToken: string | undefined;
    let courierTokenExpiresAt: Date | undefined;

    let deliveryLat: number | null = Number.isFinite(Number(rest.deliveryLat))
      ? Number(rest.deliveryLat)
      : null;
    let deliveryLng: number | null = Number.isFinite(Number(rest.deliveryLng))
      ? Number(rest.deliveryLng)
      : null;
    let courierId: string | null = null;

    if (isDelivery) {
      courierToken = uuid();
      courierTokenExpiresAt = new Date(Date.now() + COURIER_TOKEN_VALIDITY_MS);
      courierId = await getGuestCourierId(rest.branchId);
      // Geocoding runs after kitchen notification when coords were not supplied at checkout
    }

    const paymentMethod = normalizePaymentMethod(rest.paymentMethod);

    const marketingEmail = Boolean(rest.marketingEmail);
    const marketingSMS = Boolean(rest.marketingSMS);
    const marketingWhatsApp = Boolean(rest.marketingWhatsApp);
    const hasMarketingConsent = marketingEmail || marketingSMS || marketingWhatsApp;
    const customerEmail = rest.customerEmail?.trim() || null;

    if (marketingEmail && !customerEmail) {
      throw new Error("E-Mail-Adresse erforderlich für Angebote per E-Mail");
    }

    const createPayload = {
      id: randomUUID(),
      branchId: rest.branchId,
      customerId: rest.customerId,
      customerName,
      customerPhone,
      customerEmail,
      freeDrinkChoice,
      marketingEmail,
      marketingSMS,
      marketingWhatsApp,
      marketingConsentAt: hasMarketingConsent ? new Date() : null,
      termsAcceptedAt: new Date(),
      deliveryAddress: isDelivery ? deliveryAddress : null,
      fulfillmentType,
      postalCode,
      notes: notes || null,
      orderTotal: discountedSubtotal + deliveryFee,
      discount: totalDiscount,
      promoCodeId,
      giftCardId,
      giftCardAmount: giftCardAmount > 0 ? giftCardAmount : null,
      deliveryFee,
      scheduledFor,
      paymentMethod,
      isGuest: rest.isGuest ?? true,
      courierStatus: isDelivery ? "pending" : null,
      courierId,
      courierToken,
      courierTokenExpiresAt,
      deliveryLat,
      deliveryLng,
      paymentStatus: requiresOnlinePayment(paymentMethod)
        ? "awaiting_payment"
        : (rest.paymentStatus ?? "pending"),
      status: "pending",
      tracking_token: trackingToken,
      pushToken: rest.pushToken?.trim() || null,
      items: {
        create: buildOrderItems(pricedLines)
      }
    } as any;

    logger.debug({ branchId: rest.branchId, fulfillmentType, scheduledFor }, "Creating order");

    const order = await prisma.order.create({
      data: createPayload,
      include: {
        items: {
          include: ORDER_ITEMS_INCLUDE
        }
      }
    });

    const payload = enrichOrder(order);
    if (!requiresOnlinePayment(paymentMethod)) {
      broadcastToTerminal(order.branchId, "order:new", payload);
    }

    if (isDelivery && deliveryAddress && (deliveryLat == null || deliveryLng == null)) {
      const geoQuery = postalCode
        ? `${deliveryAddress}, ${postalCode}, Deutschland`
        : deliveryAddress;
      void geocodeAddress(geoQuery, { postalCode: postalCode ?? undefined }).then((geo) => {
        if (!geo) return;
        void prisma.order
          .update({
            where: { id: order.id },
            data: { deliveryLat: geo.lat, deliveryLng: geo.lng }
          })
          .catch((err) => {
            logger.warn({ err, orderId: order.id }, "Async geocode update failed");
          });
      });
    }

    if (promoCodeId) {
      try {
        await redeemPromoCode(promoCodeId);
      } catch (err) {
        logger.warn({ err, orderId: order.id, promoCodeId }, "Promo redemption failed after order create");
      }
    }
    if (giftCardId && giftCardAmount > 0) {
      try {
        await redeemGiftCard(giftCardId, giftCardAmount);
      } catch (err) {
        logger.warn({ err, orderId: order.id, giftCardId }, "Gift card redemption failed after order create");
      }
    }
    if (customerCouponId) {
      try {
        await redeemCustomerCoupon(customerCouponId, order.id);
      } catch (err) {
        logger.warn({ err, orderId: order.id, customerCouponId }, "Coupon redemption failed after order create");
      }
    }

    await syncBranchCustomerFromOrder({
      branchId: rest.branchId,
      phone: customerPhone,
      name: customerName,
      email: customerEmail,
      birthday: rest.birthday ?? null,
      marketingEmail,
      marketingSMS,
      marketingWhatsApp,
      orderTotal: Number(order.orderTotal ?? 0),
      savedAmount:
        Number(order.discount ?? 0) + Number(order.giftCardAmount ?? 0)
    }).catch((err) => {
      logger.warn({ err, orderId: order.id }, "Branch customer sync failed");
    });

    if (rest.pushToken?.trim()) {
      const offerConsent = marketingEmail || marketingSMS || marketingWhatsApp;
      void persistPushSubscriptionFromOrder({
        token: rest.pushToken.trim(),
        customerId: rest.customerId ?? null,
        branchId: rest.branchId,
        // undefined preserves allowOffers from checkout subscribeToPush (e.g. push-only opt-in)
        allowOffers: offerConsent ? true : undefined,
        customerEmail
      }).catch((err) => {
        logger.warn({ err, orderId: order.id }, "Failed to persist push subscription");
      });
    }

    void prisma.orderTrackingEvent
      .create({
        data: {
          id: randomUUID(),
          orderId: order.id,
          status: "pending",
          timestamp: new Date()
        }
      })
      .catch((err) => {
        logger.warn({ err, orderId: order.id }, "Order tracking event failed");
      });

    if (!requiresOnlinePayment(paymentMethod)) {
      void sendOrderConfirmationEmail(order.id).catch((err) => {
        logger.warn({ err, orderId: order.id }, "Order confirmation email failed");
      });
    }

    return payload;
  }

  async notifyKitchenOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: ORDER_ITEMS_INCLUDE
        }
      }
    });
    if (!order) throw new Error("Order not found");

    const payload = enrichOrder(order);
    broadcastToTerminal(order.branchId, "order:new", payload);
    return payload;
  }

  async confirmOrderWithPrepTime(orderId: string, prepMinutes: number) {
    if (!Number.isFinite(prepMinutes) || prepMinutes < 5 || prepMinutes > 180) {
      throw new Error("Prep time must be between 5 and 180 minutes");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: ORDER_ITEMS_INCLUDE }
      }
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "pending") {
      throw new Error("Order has already been confirmed");
    }
    if (!isKitchenReadyOrder(order)) {
      throw new Error("Payment has not been completed for this order");
    }

    const scheduledFor = order.scheduledFor ? new Date(order.scheduledFor) : null;
    const hasScheduled =
      scheduledFor != null &&
      !Number.isNaN(scheduledFor.getTime()) &&
      scheduledFor.getTime() > Date.now();

    let etaReadyAt: Date;
    let etaDeliveredAt: Date | undefined;
    let estimatedTotalTime = prepMinutes;

    if (hasScheduled && scheduledFor) {
      etaReadyAt = scheduledFor;
      etaDeliveredAt = scheduledFor;
      estimatedTotalTime = Math.max(
        5,
        Math.ceil((scheduledFor.getTime() - Date.now()) / 60_000)
      );
    } else {
      etaReadyAt = new Date(Date.now() + prepMinutes * 60_000);
      if (order.fulfillmentType === "delivery") {
        etaDeliveredAt = etaReadyAt;
      }
    }

    const updated = await OrderLifecycleService.updateStatus(orderId, "accepted", undefined, {
      estimatedPrepTime: prepMinutes,
      estimatedTotalTime,
      etaReadyAt,
      etaDeliveredAt,
      confirmedAt: new Date()
    });

    void routeOrderToKitchens(orderId).catch((err) => {
      logger.warn({ err, orderId }, "Kitchen routing failed after confirm");
    });

    const payload = enrichOrder({
      ...order,
      ...updated,
      items: order.items
    });
    broadcastToTerminal(order.branchId, "order:confirmed", payload);

    return payload;
  }

  async cancelUnpaidOnlineOrder(orderId: string, cancelReason?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (!isUnpaidOnlineOrder(order)) {
      return { cancelled: false, reason: "not_unpaid_online" as const };
    }
    if (order.status !== "pending") {
      return { cancelled: false, reason: "not_pending" as const };
    }

    const { cancelReasonToTrackingStatus } = await import("../utils/orderPayment.ts");

    await OrderLifecycleService.updateStatus(orderId, "cancelled", undefined, {
      paymentStatus: "cancelled"
    });

    await prisma.orderTrackingEvent.create({
      data: {
        id: randomUUID(),
        status: cancelReasonToTrackingStatus(cancelReason),
        timestamp: new Date(),
        order: { connect: { id: orderId } }
      }
    });

    broadcastToTerminal(order.branchId, "order_status", {
      orderId,
      id: orderId,
      status: "cancelled"
    });

    return { cancelled: true as const };
  }

  async listBranchOrders(branchId: string) {
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

  async getOrderStatus(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        trackingEvents: { orderBy: { timestamp: "asc" } },
        review: true
      }
    });

    if (!order) {
      throw fail("NOT_FOUND", "Order not found");
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

    const reviewableStatuses = new Set(["delivered", "completed", "picked_up"]);

    const canReview = reviewableStatuses.has(order.status) && !order.review;

    return {
      id: order.id,
      status: order.status,
      orderTotal: order.orderTotal,
      deliveryFee: order.deliveryFee,
      courierStatus: order.courierStatus,
      fulfillmentType: order.fulfillmentType,
      canReview,
      hasReview: !!order.review,
      trackingUrl: buildOrderTrackingUrl(order.id),
      reviewUrl: canReview ? buildOrderReviewUrl(order.id) : null,
      review: order.review
        ? {
            id: order.review.id,
            foodRating: order.review.foodRating,
            deliveryRating: order.review.deliveryRating,
            rating: order.review.rating,
            comment: order.review.comment,
            createdAt: order.review.createdAt
          }
        : null,
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

  async updateStatus(orderId: string, status: string) {
    return OrderLifecycleService.updateStatus(orderId, status);
  }

  async generateCourierToken(orderId: string) {
    const token = uuid();
    const expiresAt = new Date(Date.now() + COURIER_TOKEN_VALIDITY_MS);
    return OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
  }

  async listCustomerOrders(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { item: true } },
        review: true
      }
    });
  }

  async validateCourierToken(orderId: string, token: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;
    if (order.courierToken !== token) return null;
    if (!order.courierTokenExpiresAt) return null;
    if (order.courierTokenExpiresAt < new Date()) return null;
    return order;
  }

  async courierPickedUp(orderId: string) {
    return OrderLifecycleService.updateStatus(orderId, "picked_up", undefined, {
      courierStatus: "picked_up"
    });
  }

  async courierDelivered(orderId: string) {
    return OrderLifecycleService.updateStatus(orderId, "delivered", undefined, {
      courierStatus: "delivered"
    });
  }
}

export const ordersService = new OrdersService();
