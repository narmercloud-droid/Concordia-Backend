import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["accepted", "rejected", "cancelled", "assigned", "acknowledged"],
  accepted: ["preparing", "rejected", "out_for_delivery", "cancelled"],
  preparing: ["ready_for_pickup", "out_for_delivery", "rejected", "cancelled"],
  ready_for_pickup: ["picked_up", "cancelled"],
  out_for_delivery: ["picked_up", "delivered", "cancelled"],
  picked_up: ["delivered", "cancelled"],
  assigned: ["accepted", "rejected", "acknowledged"],
  acknowledged: ["accepted", "rejected"],
  courier_assigned: ["out_for_delivery", "picked_up", "delivered", "rejected"],
  completed: [],
  delivered: [],
  rejected: [],
  cancelled: []
};
const STATUS_ALIASES: Record<string, string> = {
  ready: "ready_for_pickup"
};

function isPickupFulfillment(fulfillmentType?: string | null) {
  const t = (fulfillmentType ?? "").toLowerCase();
  return t.includes("pickup") || t.includes("abhol");
}

export class OrderLifecycleService {
  static normalizeStatus(status: string) {
    return STATUS_ALIASES[status] ?? status;
  }

  static async updatePaymentStatus(orderId: string, paymentStatus: string, extraData?: Record<string, unknown>) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { paymentStatus, ...(extraData ?? {}) } });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: `payment:${paymentStatus}`,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, trackingEvents: { orderBy: { timestamp: "asc" } } } });
      if (!result) throw new Error("Failed to fetch updated order");
      return result;
    });
  }

  static async setCourierToken(orderId: string, token: string, expiresAt: Date) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { courierToken: token, courierTokenExpiresAt: expiresAt } });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: `courier:token_generated`,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, trackingEvents: { orderBy: { timestamp: "asc" } } } });
      if (!result) throw new Error("Failed to fetch updated order");
      return result;
    });
  }

  static async clearCourierToken(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { courierToken: null, courierTokenExpiresAt: null } });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: `courier:token_cleared`,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, trackingEvents: { orderBy: { timestamp: "asc" } } } });
      if (!result) throw new Error("Failed to fetch updated order");
      return result;
    });
  }

  static async updateCourierStatus(orderId: string, courierStatus: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { courierStatus } });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: `courier:${courierStatus}`,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, trackingEvents: { orderBy: { timestamp: "asc" } } } });
      if (!result) throw new Error("Failed to fetch updated order");
      return result;
    });
  }

  static async assignCourier(orderId: string, courierId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { courierId, courierStatus: "assigned" } });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: `courier:assigned`,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, trackingEvents: { orderBy: { timestamp: "asc" } } } });
      if (!result) throw new Error("Failed to fetch updated order");
      return result;
    });
  }
  static isTransitionAllowed(
    currentStatus: string,
    nextStatus: string,
    fulfillmentType?: string | null
  ) {
    const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
    if (allowed.includes(nextStatus)) return true;

    // Delivery orders may be marked "ready" in kitchen; staff then sends them out.
    if (
      currentStatus === "ready_for_pickup" &&
      nextStatus === "out_for_delivery" &&
      !isPickupFulfillment(fulfillmentType)
    ) {
      return true;
    }

    return false;
  }

  static async updateStatus(
    orderId: string,
    newStatus: string,
    scheduledFor?: Date,
    extraData?: Record<string, unknown>
  ) {
    const resolvedStatus = this.normalizeStatus(newStatus);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === resolvedStatus && !extraData) {
      return prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          trackingEvents: {
            orderBy: { timestamp: "asc" }
          }
        }
      });
    }

    const fulfillmentContext =
      order.deliveryAddress?.trim() && !isPickupFulfillment(order.fulfillmentType)
        ? "delivery"
        : order.fulfillmentType;

    if (!this.isTransitionAllowed(order.status, resolvedStatus, fulfillmentContext)) {
      throw new Error(`Invalid status transition from ${order.status} to ${resolvedStatus}`);
    }

    return prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: resolvedStatus,
          scheduledFor: scheduledFor ?? undefined,
          ...extraData
        }
      });

      await tx.orderTrackingEvent.create({
        data: {
          id: randomUUID(),
          status: resolvedStatus,
          timestamp: new Date(),
          order: { connect: { id: orderId } }
        }
      });

      const result = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          trackingEvents: {
            orderBy: { timestamp: "asc" }
          }
        }
      });

      if (!result) {
        throw new Error("Failed to fetch updated order");
      }

      return result;
    }).then(async (result) => {
      try {
        const { awardLoyaltyForCompletedOrder } = await import("../loyalty.service.ts");
        await awardLoyaltyForCompletedOrder(orderId);
      } catch (error) {
        console.error("Loyalty award failed for order", orderId, error);
      }

      try {
        const { sendOrderReviewInvitation } = await import("../customer/orderReviewNotification.service.ts");
        await sendOrderReviewInvitation(orderId);
      } catch (error) {
        console.error("Review invitation failed for order", orderId, error);
      }

      return result;
    });
  }
}
