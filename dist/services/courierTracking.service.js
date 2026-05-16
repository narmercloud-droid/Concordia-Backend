import { prisma } from "../prisma/client.js";
export class CourierTrackingService {
    async updateLocation(courierId, data) {
        const payload = {
            ...data,
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
        };
        const location = await prisma.courierLocation.upsert({
            where: { courierId },
            update: { ...payload },
            create: { courierId, ...payload }
        });
        // Emit location update
        this.emitLocationUpdate(courierId, location);
        return location;
    }
    async emitLocationUpdate(courierId, location) {
        const { getIO, getCouriersNamespace, getAdminNamespace } = await import("../socket/index.js");
        const courier = await prisma.courier.findUnique({ where: { id: courierId } });
        const branchRoom = courier?.branchId ? `branch_${courier.branchId}` : undefined;
        const eventData = {
            success: true,
            event: "courier:location_update",
            data: {
                courierId,
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    speed: location.speed,
                    heading: location.heading,
                    updatedAt: location.updatedAt
                }
            }
        };
        // Emit to courier namespace
        if (branchRoom) {
            getCouriersNamespace().to(branchRoom).emit("courier:location_update", eventData);
        }
        else {
            getCouriersNamespace().emit("courier:location_update", eventData);
        }
        // Emit to admin namespace
        if (branchRoom) {
            getAdminNamespace().to(branchRoom).emit("courier:location_update", eventData);
        }
        else {
            getAdminNamespace().emit("courier:location_update", eventData);
        }
        // Emit to customer's order room if courier has active orders
        const activeOrders = await prisma.order.findMany({
            where: {
                courierToken: courierId,
                status: { in: ["out_for_delivery", "picked_up"] }
            }
        });
        for (const order of activeOrders) {
            if (order.customerId) {
                getIO().to(`customer_${order.customerId}`).emit("courier:location_update", eventData);
            }
        }
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
        let courierLocation = null;
        if (order.courierToken) {
            courierLocation = await this.getCourierLocation(order.courierToken);
        }
        return {
            orderStatus: order.status,
            courierLocation,
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
