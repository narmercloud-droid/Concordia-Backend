import { prisma } from "../../prisma/client.js";

export const KdsService = {
  getActiveOrders: async (branchId: string) => {
    return prisma.order.findMany({
      where: {
        branchId: branchId,
        status: { in: ["accepted", "preparing", "ready"] }
      },
      orderBy: { createdAt: "asc" },
      include: {
        items: true
      }
    });
  },
  updateStatus: async (orderId: string, status: string) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any }
    });
  }
};
