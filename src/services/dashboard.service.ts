import { prisma } from "../prisma/client.js";

export class DashboardService {
  async globalRevenue(): Promise<any> {
    return prisma.order.count({
      where: { paymentStatus: "paid" }
    });
  }

  async branchRevenue(branchId: string): Promise<any> {
    return prisma.order.count({
      where: { branchId, paymentStatus: "paid" }
    });
  }

  async globalOrders(): Promise<number> {
    return prisma.order.count();
  }

  async branchOrders(branchId: string): Promise<number> {
    return prisma.order.count({ where: { branchId } });
  }

  async menuPerformance(branchId?: string): Promise<any[]> {
    return prisma.orderItem.findMany({
      where: branchId ? { order: { branchId } } : undefined,
      select: {
        itemId: true,
        quantity: true
      },
      orderBy: { quantity: "desc" }
    });
  }

  async courierPerformance(branchId?: string): Promise<any[]> {
    return prisma.order.findMany({
      where: branchId ? { branchId } : undefined,
      select: {
        courierStatus: true,
        id: true
      }
    });
  }

  async topSearches(): Promise<any[]> {
    return prisma.searchLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  async loyaltyStats(): Promise<any> {
    return prisma.loyaltyPoints.aggregate({
      _sum: { points: true },
      _avg: { points: true }
    });
  }

  async customerStats(): Promise<any> {
    const total = await prisma.customer.count();
    const active = await prisma.customer.count({
      where: {
        orders: { some: {} }
      }
    });

    return { total, active, inactive: total - active };
  }
}

export const dashboardService = new DashboardService();
