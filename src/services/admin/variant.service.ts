import { prisma } from "../../prisma/client";

export class VariantService {
  static async getAll() {
    return prisma.variant.findMany({
      orderBy: { sort_order: "asc" }
    });
  }

  static async getById(id: number) {
    return prisma.variant.findUnique({
      where: { variant_id: id }
    });
  }

  static async create(data: any) {
    return prisma.variant.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.variant.update({
      where: { variant_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.variant.delete({
      where: { variant_id: id }
    });
  }
}
