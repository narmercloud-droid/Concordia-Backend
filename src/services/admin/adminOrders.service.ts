import { prisma } from "../../prisma/client.js";

export class AdminOrdersService {
  static async getAll(branchId: string, filters: {
    status?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { status, customerId, startDate, endDate, page = 1, limit = 20 } = filters;

    const where: any = { branchId };
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.order.count({ where });

    return { orders, total, page, limit };
  }

  static async getById(orderId: string, branchId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, branchId },
      include: {
        customer: true,
        items: {
          include: {
            item: true
          }
        }
      }
    });
  }

  static async updateStatus(orderId: string, branchId: string, status: string, estimatedTime?: number) {
    const updated = await prisma.order.updateMany({
      where: { id: orderId, branchId },
      data: {
        status,
        scheduledFor: estimatedTime ? new Date(Date.now() + estimatedTime * 60000) : undefined
      }
    });

    if (updated.count === 0) throw new Error("Order not found for branch");

    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true
      }
    });
  }

  static async assignCourier(orderId: string, branchId: string, courierToken: string) {
    const updated = await prisma.order.updateMany({
      where: { id: orderId, branchId },
      data: { courierToken }
    });

    if (updated.count === 0) throw new Error("Order not found for branch");

    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true
      }
    });
  }
}
