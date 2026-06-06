import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
import { OrderLifecycleService } from "./order/orderLifecycle.service.js";
export class CourierTrackingService {
    async updateLocation(courierId, data) {
        return prisma.courierLocation.create({
            data: {
                id: randomUUID(),
                latitude: data.lat,
                longitude: data.lng,
                accuracy: data.accuracy ?? null,
                courier: { connect: { id: courierId } },
                order: data.orderId ? { connect: { id: data.orderId } } : undefined
            }
        });
    }
    async getCourierLocation(courierId) {
        return prisma.courierLocation.findFirst({
            where: { courierId },
            orderBy: { createdAt: "desc" }
        });
    }
    async addTrackingEvent(orderId, status) {
        // Delegate to lifecycle service so transitions and tracking are centralized
        return OrderLifecycleService.updateStatus(orderId, status);
    }
    async getOrderTimeline(orderId) {
        return prisma.orderTrackingEvent.findMany({
            where: { orderId },
            orderBy: { timestamp: "asc" }
        });
    }
    async getCustomerTracking(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });
        if (!order)
            throw new Error("Order not found");
        const timeline = await this.getOrderTimeline(orderId);
        return {
            orderStatus: order.status,
            courierLocation: null,
            timeline
        };
    }
    async getActiveCouriers(branchId) {
        return prisma.courierLocation.findMany({
            where: {
                courier: { branchId }
            },
            include: {
                courier: true
            }
        });
    }
}
export const courierTrackingService = new CourierTrackingService();
