import { prisma } from "../../prisma/client.js";
import { OrderSocket } from "../../socket/order.socket.js";
import { AdminSocket } from "../../socket/admin.socket.js";
export class OrderService {
    static async createOrder(orderData) {
        const { branchId, customerId, isGuest = false, paymentMethod, items } = orderData;
        if (!items || items.length === 0) {
            throw new Error("Order must have at least one item");
        }
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = await prisma.order.create({
            data: {
                branchId,
                customerId,
                isGuest,
                paymentMethod,
                paymentStatus: "pending",
                status: "pending",
                items: {
                    create: items.map(item => ({
                        itemId: item.itemId,
                        variantId: item.variantId,
                        addOnIds: item.addOnIds || [],
                        quantity: item.quantity,
                        notes: item.notes,
                        price: item.price
                    }))
                }
            },
            select: {
                id: true,
                branchId: true,
                customerId: true,
                status: true,
                paymentMethod: true,
                paymentStatus: true,
                createdAt: true,
                items: {
                    select: {
                        itemId: true,
                        variantId: true,
                        addOnIds: true,
                        quantity: true,
                        price: true
                    }
                }
            }
        });
        try {
            const { DemandForecastService } = await import("../../services/ai/demandForecast.service.js");
            await DemandForecastService.recordBranchDemand(order);
            await AdminSocket.triggerAIUpdateAfterOrder(order);
            await AdminSocket.triggerDemandUpdate(order);
        }
        catch (error) {
            console.error("Failed to update demand analytics:", error);
        }
        this.emitOrderEvent(order, "created");
        this.emitOrderStatus(order);
        return order;
    }
    static async emitOrderEvent(order, eventType) {
        const { getIO, getOrdersNamespace, getKDSNamespace, getAdminNamespace } = await import("../../socket/index.js");
        const eventData = {
            success: true,
            event: `order:${eventType}`,
            data: {
                orderId: order.id,
                status: order.status,
                customerId: order.customerId,
                branchId: order.branchId,
                createdAt: order.createdAt
            }
        };
        if (order.customerId) {
            getIO().to(`customer_${order.customerId}`).emit(`order:${eventType}`, eventData);
        }
        getOrdersNamespace().to(`branch_${order.branchId}`).emit(`order:${eventType}`, eventData);
        getKDSNamespace().to(`kds_branch_${order.branchId}`).emit(`order:${eventType}`, eventData);
        getAdminNamespace().to(`branch_${order.branchId}`).emit(`order:${eventType}`, eventData);
    }
    static async emitOrderStatus(order) {
        const { getIO, getOrdersNamespace, getKDSNamespace, getAdminNamespace } = await import("../../socket/index.js");
        const eventData = {
            success: true,
            event: `order:${order.status}`,
            data: {
                orderId: order.id,
                status: order.status,
                customerId: order.customerId,
                branchId: order.branchId,
                updatedAt: order.updatedAt
            }
        };
        if (order.customerId) {
            getIO().to(`customer_${order.customerId}`).emit(`order:${order.status}`, eventData);
        }
        getOrdersNamespace().to(`branch_${order.branchId}`).emit(`order:${order.status}`, eventData);
        getKDSNamespace().to(`kds_branch_${order.branchId}`).emit(`order:${order.status}`, eventData);
        getAdminNamespace().to(`branch_${order.branchId}`).emit(`order:${order.status}`, eventData);
    }
    static async updateStatus(orderId, status, estimated_time) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                scheduledFor: estimated_time ? new Date(Date.now() + estimated_time * 60000) : undefined
            },
            select: {
                id: true,
                branchId: true,
                customerId: true,
                status: true,
                updatedAt: true
            }
        });
        if (status === "preparing") {
            try {
                const { PrintService } = await import("../../services/print/print.service.js");
                await PrintService.printOrder(order.id);
            }
            catch (error) {
                console.error("Failed to print order:", error);
            }
        }
        if (status === "delivered") {
            try {
                const { CustomerAnalyticsService } = await import("../../services/ai/customerAnalytics.service.js");
                const { MenuAnalyticsService } = await import("../../services/ai/menuAnalytics.service.js");
                const { CourierAnalyticsService } = await import("../../services/ai/courierAnalytics.service.js");
                const { DemandForecastService } = await import("../../services/ai/demandForecast.service.js");
                await CustomerAnalyticsService.updateCustomerStats(order);
                await MenuAnalyticsService.updateMenuItemStats(order);
                await DemandForecastService.recordBranchDemand(order);
                await CourierAnalyticsService.updateCourierPerformance(order);
                await AdminSocket.triggerChurnUpdate(order);
                await AdminSocket.triggerDemandUpdate(order);
                await AdminSocket.triggerCourierPerformanceUpdate(order);
                await AdminSocket.triggerAIUpdateAfterOrder(order);
            }
            catch (error) {
                console.error("Failed to update analytics:", error);
            }
        }
        this.emitOrderStatus(order);
        return order;
    }
    static async courierPickup(orderId) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: "picked_up" }
        });
        OrderSocket.orderUpdated(order);
        return order;
    }
    static async getActiveOrders() {
        return prisma.order.findMany({
            where: {
                status: {
                    in: ["pending", "accepted", "preparing", "ready_for_pickup"]
                }
            },
            orderBy: { createdAt: "asc" },
            take: 50,
            select: {
                id: true,
                branchId: true,
                status: true,
                createdAt: true,
                items: {
                    select: {
                        itemId: true,
                        quantity: true,
                        price: true
                    }
                }
            }
        });
    }
    static async getOrderById(orderId) {
        return prisma.order.findUnique({
            where: { id: orderId },
            select: {
                id: true,
                branchId: true,
                customerId: true,
                status: true,
                paymentMethod: true,
                paymentStatus: true,
                createdAt: true,
                updatedAt: true,
                items: {
                    select: {
                        itemId: true,
                        variantId: true,
                        addOnIds: true,
                        quantity: true,
                        price: true,
                        notes: true
                    }
                }
            }
        });
    }
}
