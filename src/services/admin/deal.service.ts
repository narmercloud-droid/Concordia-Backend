import { prisma } from "../../prisma/client.js";

export class DealService {
  static async getAll() {
    return prisma.deal.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.deal.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.deal.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.deal.delete({
      where: { id },
    });
  }
}
