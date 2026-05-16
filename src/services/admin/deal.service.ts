import { prisma } from "../../prisma/client.js";

export class DealService {
  static async getAll(branchId: string) {
    return prisma.deal.findMany({
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string, branchId: string) {
    return prisma.deal.findFirst({
      where: { id }
    });
  }

  static async create(branchId: string, data: any) {
    return prisma.deal.create({ data });
  }

  static async update(id: string, branchId: string, data: any) {
    return prisma.deal.update({
      where: { id },
      data
    });
  }

  static async remove(id: string, branchId: string) {
    return prisma.deal.deleteMany({
      where: { id }
    });
  }
}
