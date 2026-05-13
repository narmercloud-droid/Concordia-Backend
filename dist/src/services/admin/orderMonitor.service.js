import { prisma } from "../../prisma/client.js";
export class OrderMonitorService {
    static async getLiveOrders() {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                branchId: true,
                terminalId: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return orders.map((order) => ({
            order_id: order.id,
            branch_id: order.branchId,
            terminal_id: order.terminalId,
            status: order.status,
            created_at: order.createdAt,
        }));
    }
}
