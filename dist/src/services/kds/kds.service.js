import { prisma } from "../../prisma/client.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
export const KdsService = {
    getActiveOrders: async (branchId) => {
        return prisma.order.findMany({
            where: {
                branchId: branchId,
                status: { in: ["accepted", "preparing", "ready"] }
            },
            orderBy: { createdAt: "asc" },
            include: {
                items: true
            }
        });
    },
    updateStatus: async (orderId, status) => {
        return OrderLifecycleService.updateStatus(orderId, status);
    }
};
