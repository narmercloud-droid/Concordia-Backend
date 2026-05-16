import { prisma } from "../../prisma/client.js";

export class AdminCouriersService {
  static async getAll(branchId: string) {
    return prisma.courier.findMany({
      where: { branchId },
      include: {
        locations: true,
        courierPerformance: true
      },
      orderBy: { name: "asc" }
    });
  }

  static async getById(courierId: string, branchId: string) {
    return prisma.courier.findFirst({
      where: { id: courierId, branchId },
      include: {
        locations: true,
        courierPerformance: true
      }
    });
  }

  static async create(branchId: string, data: any) {
    const { password, ...courierData } = data;
    return prisma.courier.create({
      data: {
        ...courierData,
        branchId,
        active: true
      }
    });
  }

  static async update(courierId: string, branchId: string, data: any) {
    const updated = await prisma.courier.updateMany({
      where: { id: courierId, branchId },
      data
    });

    if (updated.count === 0) throw new Error("Courier not found for branch");

    return prisma.courier.findUnique({ where: { id: courierId } });
  }

  static async toggleActive(courierId: string, branchId: string) {
    const courier = await prisma.courier.findFirst({ where: { id: courierId, branchId } });
    if (!courier) throw new Error("Courier not found");

    return prisma.courier.update({
      where: { id: courierId },
      data: { active: !courier.active }
    });
  }

  static async getOrderHistory(courierId: string, branchId: string) {
    return prisma.order.findMany({
      where: { courierToken: courierId, branchId },
      include: {
        customer: true,
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}