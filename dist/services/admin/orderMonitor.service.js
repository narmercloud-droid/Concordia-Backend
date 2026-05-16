import { prisma } from "../../prisma/client.js";
export class OrderMonitorService {
    static async getLiveOrders(branchId, limit = 50) {
        const orders = await prisma.order.findMany({
            where: branchId ? { branchId } : {},
            select: {
                id: true,
                branchId: true,
                terminal_id: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        return orders.map((order) => ({
            order_id: order.id,
            branch_id: order.branchId,
            terminal_id: order.terminal_id,
            status: order.status,
            created_at: order.createdAt,
        }));
    }
}
