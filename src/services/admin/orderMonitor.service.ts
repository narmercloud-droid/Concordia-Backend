import { prisma } from "../../prisma/client";

export class OrderMonitorService {
  static async getLiveOrders() {
    const orders = await prisma.order.findMany({
      select: {
        order_id: true,
        branch_id: true,
        terminal_id: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      order_id: order.order_id,
      branch_id: order.branch_id,
      terminal_id: order.terminal_id,
      status: order.status,
      created_at: order.createdAt,
    }));
  }
}