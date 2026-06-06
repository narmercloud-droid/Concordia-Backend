import { prisma } from "../../prisma/client.ts";
import { cacheDashboardMetrics, getDashboardMetrics } from "../../lib/redis.ts";

export class AdminDashboardService {
  static async getMetrics(branchId: string) {
    const cachedMetrics = await getDashboardMetrics(branchId);
    if (cachedMetrics) {
      return cachedMetrics;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const orderFilter = { status: "delivered", branchId };

    const [salesAgg, totalOrders, todayAgg, activeCouriers, activeCustomers, topSellingItems] = await Promise.all([
      prisma.orderItem.aggregate({ _sum: { price: true }, where: { order: orderFilter } }),
      prisma.order.count({ where: orderFilter }),
      prisma.orderItem.aggregate({ _sum: { price: true }, where: { order: { ...orderFilter, createdAt: { gte: startOfDay } } } }),
      prisma.courier.count({ where: { active: true, branchId } }),
      prisma.customer.count({ where: { orders: { some: { branchId, createdAt: { gte: startOfMonth } } } } }),
      prisma.orderItem.groupBy({
        by: ["itemId"],
        _sum: { quantity: true },
        where: { order: { branchId } },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10
      })
    ]);

    const itemIds = topSellingItems.map((item) => item.itemId);
    const items = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true }
    });

    const topItems = topSellingItems.map((item) => ({
      itemId: item.itemId,
      quantity: item._sum.quantity,
      item: items.find((i) => i.id === item.itemId) || null
    }));

    const metrics = {
      totalSales: salesAgg._sum.price || 0,
      totalOrders,
      todaySales: todayAgg._sum.price || 0,
      activeCouriers,
      activeCustomers,
      topSellingItems: topItems
    };

    await cacheDashboardMetrics(branchId, metrics, 5);
    return metrics;
  }

  static async getSalesChart(_period: "daily" | "weekly" | "monthly", _branchId: string) {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 1000) + 100
      });
    }
    return data.reverse();
  }

  static async getOrderChart(_period: "daily" | "weekly" | "monthly", _branchId: string) {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        orders: Math.floor(Math.random() * 50) + 10
      });
    }
    return data.reverse();
  }

  static async emitMetricsUpdate(branchId: string) {
    const { getAdminNamespace } = await import("../../socket/index.ts");
    const metrics = await this.getMetrics(branchId);

    const eventData = {
      success: true,
      event: "admin:metrics_update",
      data: metrics
    };

    getAdminNamespace().to(`branch_${branchId}`).emit("admin:metrics_update", eventData);
  }

  static async emitOrderUpdate(order: any) {
    const { getAdminNamespace } = await import("../../socket/index.ts");

    const eventData = {
      success: true,
      event: "admin:order_update",
      data: {
        orderId: order.id,
        status: order.status,
        customerId: order.customerId,
        createdAt: order.createdAt
      }
    };

    getAdminNamespace().to(`branch_${order.branchId}`).emit("admin:order_update", eventData);
    this.emitMetricsUpdate(order.branchId);
  }

  static async emitCourierUpdate(courier: any) {
    const { getAdminNamespace } = await import("../../socket/index.ts");

    const eventData = {
      success: true,
      event: "admin:courier_update",
      data: {
        courierId: courier.id,
        name: courier.name,
        active: courier.active,
        location: courier.location
      }
    };

    getAdminNamespace().to(`branch_${courier.branchId}`).emit("admin:courier_update", eventData);
    this.emitMetricsUpdate(courier.branchId);
  }
}





