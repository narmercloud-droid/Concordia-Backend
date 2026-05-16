import { prisma } from "../prisma/client.js";
export class CourierTrackingService {
    async updateLocation(courierId, data) {
        return prisma.courierLocation.upsert({
            where: { courierId },
            update: { ...data },
            create: { courierId, ...data }
        });
    }
    async getCourierLocation(courierId) {
        return prisma.courierLocation.findUnique({
            where: { courierId }
        });
    }
    async addTrackingEvent(orderId, status) {
        return prisma.orderTrackingEvent.create({
            data: { orderId, status }
        });
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
