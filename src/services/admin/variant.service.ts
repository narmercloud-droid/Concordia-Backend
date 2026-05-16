import { prisma } from "../../prisma/client.js";

export class VariantService {
  static async getAll(branchId: string) {
    return prisma.variant.findMany({
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string, branchId: string) {
    return prisma.variant.findFirst({
      where: { id }
    });
  }

  static async create(branchId: string, data: any) {
    return prisma.variant.create({ data });
  }

  static async update(id: string, branchId: string, data: any) {
    return prisma.variant.update({
      where: { id },
      data
    });
  }

  static async remove(id: string, branchId: string) {
    return prisma.variant.deleteMany({
      where: { id }
    });
  }
}
