import { prisma } from "../prisma/client.ts";

const success = (payload: any) => payload;

function modelExists(modelName: string) {
  return typeof (prisma as any)[modelName] !== "undefined";
}

export class AnalyticsService {
  // TOTAL REVENUE
  async totalRevenue(branchId?: string): Promise<any> {
    if (!modelExists("order")) return success({ message: "Analytics temporarily disabled" });

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
    if (!modelExists("order")) return success({ message: "Analytics temporarily disabled" });

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
    if (!modelExists("orderItem")) return success({ message: "Analytics temporarily disabled" });

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
    if (!modelExists("customer")) return success({ message: "Analytics temporarily disabled" });

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
    if (!modelExists("order")) return success({ message: "Analytics temporarily disabled" });

    return prisma.order.groupBy({
      by: ["courierStatus"],
      _count: { id: true }
    });
  }

  // HOURLY ORDER VOLUME
  async hourlyOrders(branchId?: string): Promise<any> {
    if (!modelExists("order")) return success({ message: "Analytics temporarily disabled" });

    if (branchId) {
      return prisma.$queryRaw`
        SELECT
          EXTRACT(HOUR FROM "createdAt") AS hour,
          COUNT(*) AS count
        FROM "Order"
        WHERE "branchId" = ${branchId}
        GROUP BY hour
        ORDER BY hour;
      `;
    }

    return prisma.$queryRaw`
      SELECT
        EXTRACT(HOUR FROM "createdAt") AS hour,
        COUNT(*) AS count
      FROM "Order"
      GROUP BY hour
      ORDER BY hour;
    `;
  }
}

export const analyticsService = new AnalyticsService();




