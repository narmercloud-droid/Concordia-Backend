import { prisma } from "../../prisma/client.ts";

export class OrderMonitorService {
  static async getLiveOrders() {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        branchId: true,
        terminal_id: true,
        status: true,
        createdAt: true,
      },
      where: {
        createdAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) }
      },
      orderBy: { createdAt: "desc" },
      take: 500,
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




