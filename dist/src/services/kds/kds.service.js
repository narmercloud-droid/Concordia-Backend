import { prisma } from "../../prisma/client.js";
export const KdsService = {
    getActiveOrders: async (branchId) => {
        return prisma.order.findMany({
            where: {
                branch_id: branchId,
                status: { in: ["accepted", "preparing", "ready"] }
            },
            orderBy: { createdAt: "asc" },
            include: {
                items: true
            }
        });
    },
    updateStatus: async (orderId, status) => {
        return prisma.order.update({
            where: { id: orderId },
            data: { status: status }
        });
    }
};
