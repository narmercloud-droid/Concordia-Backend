import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client.js";

export class AnalyticsService {
  // TOTAL REVENUE
  async totalRevenue(branchId?: string): Promise<any> {
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: "paid",
        ...(branchId ? { branchId } : {})
      },
      include: { items: true }
    });

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0),
      0
    );

    return { totalRevenue };
  }

  // ORDERS PER DAY
  async ordersPerDay(branchId?: string): Promise<any> {
    return prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        ...(branchId ? { branchId } : {})
      },
      _count: { id: true }
    });
  }

  // BEST SELLING ITEMS
  async bestSellingItems(branchId?: string): Promise<any> {
    return prisma.orderItem.groupBy({
      by: ["itemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      where: {
        order: {
          ...(branchId ? { branchId } : {})
        }
      },
      take: 20
    });
  }

  // CUSTOMER ANALYTICS
  async customerStats(): Promise<any> {
    const total = await prisma.customer.count();
    const withOrders = await prisma.customer.count({
      where: {
        orders: { some: {} }
      }
    });

    return {
      total,
      active: withOrders,
      inactive: total - withOrders
    };
  }

  // COURIER PERFORMANCE
  async courierPerformance(): Promise<any> {
    return prisma.order.groupBy({
      by: ["courierStatus"],
      _count: { id: true }
    });
  }

  // HOURLY ORDER VOLUME
  async hourlyOrders(branchId?: string): Promise<any> {
    const branchCondition = branchId
      ? Prisma.sql`WHERE "branchId" = ${branchId}`
      : Prisma.sql``;

    return prisma.$queryRaw(Prisma.sql`
      SELECT
        EXTRACT(HOUR FROM "createdAt") AS hour,
        COUNT(*) AS count
      FROM "Order"
      ${branchCondition}
      GROUP BY hour
      ORDER BY hour;
    `);
  }
}

export const analyticsService = new AnalyticsService();
