import { prisma } from "../../prisma/client.js";

export class ExtraService {
  static async getAll(branchId: string) {
    return prisma.extra.findMany({
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string, branchId: string) {
    return prisma.extra.findFirst({
      where: { id }
    });
  }

  static async create(branchId: string, data: any) {
    return prisma.extra.create({ data });
  }

  static async update(id: string, branchId: string, data: any) {
    return prisma.extra.update({
      where: { id },
      data
    });
  }

  static async remove(id: string, branchId: string) {
    return prisma.extra.deleteMany({
      where: { id }
    });
  }
}
