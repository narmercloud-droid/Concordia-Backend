import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
const STATUS_TRANSITIONS = {
    pending: ["accepted", "rejected", "cancelled", "assigned", "acknowledged"],
    accepted: ["preparing", "rejected", "out_for_delivery", "cancelled"],
    preparing: ["ready_for_pickup", "rejected", "cancelled"],
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
const STATUS_ALIASES = {
    ready: "ready_for_pickup"
};
export class OrderLifecycleService {
    static normalizeStatus(status) {
        return STATUS_ALIASES[status] ?? status;
    }
    static async updatePaymentStatus(orderId, paymentStatus, extraData) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error("Order not found");
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
            if (!result)
                throw new Error("Failed to fetch updated order");
            return result;
        });
    }
    static async setCourierToken(orderId, token, expiresAt) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error("Order not found");
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
            if (!result)
                throw new Error("Failed to fetch updated order");
            return result;
        });
    }
    static async clearCourierToken(orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error("Order not found");
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
            if (!result)
                throw new Error("Failed to fetch updated order");
            return result;
        });
    }
    static async updateCourierStatus(orderId, courierStatus) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error("Order not found");
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
            if (!result)
                throw new Error("Failed to fetch updated order");
            return result;
        });
    }
    static async assignCourier(orderId, courierId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error("Order not found");
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
            if (!result)
                throw new Error("Failed to fetch updated order");
            return result;
        });
    }
    static isTransitionAllowed(currentStatus, nextStatus) {
        const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
        return allowed.includes(nextStatus);
    }
    static async updateStatus(orderId, newStatus, scheduledFor, extraData) {
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
        if (!this.isTransitionAllowed(order.status, resolvedStatus)) {
            throw new Error(`Invalid status transition from ${order.status} to ${resolvedStatus}`);
        }
        return prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
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
        });
    }
}
