import { prisma } from "../../prisma/client.js";

export class VariantService {
  static async getAll() {
    return prisma.variant.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    return prisma.variant.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.variant.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.variant.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.variant.delete({
      where: { id },
    });
  }
}
