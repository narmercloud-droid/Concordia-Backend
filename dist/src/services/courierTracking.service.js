import { prisma } from "../prisma/client.js";
export class CourierTrackingService {
    // Update courier GPS
    async updateLocation(courierId, data) {
        return prisma.courierLocation.upsert({
            where: { courierId },
            update: { ...data },
            create: { courierId, ...data }
        });
    }
    // Get courier location
    async getCourierLocation(courierId) {
        return prisma.courierLocation.findUnique({
            where: { courierId }
        });
    }
    // Add tracking event
    async addTrackingEvent(orderId, status) {
        return prisma.orderTrackingEvent.create({
            data: { orderId, status }
        });
    }
    // Get order timeline
    async getOrderTimeline(orderId) {
        return prisma.orderTrackingEvent.findMany({
            where: { orderId },
            orderBy: { timestamp: "asc" }
        });
    }
    // Get live tracking info for customer
    async getCustomerTracking(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { courier: true }
        });
        if (!order)
            throw new Error("Order not found");
        const courierLocation = order.courierId
            ? await prisma.courierLocation.findUnique({
                where: { courierId: order.courierId }
            })
            : null;
        const timeline = await this.getOrderTimeline(orderId);
        return {
            orderStatus: order.status,
            courierLocation,
            timeline
        };
    }
    // Manager live map
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
