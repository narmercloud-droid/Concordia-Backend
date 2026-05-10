import { prisma } from "../../prisma/client";

export class ExtraService {
  static async getAll() {
    return prisma.extra.findMany({
      orderBy: { sort_order: "asc" }
    });
  }

  static async getById(id: number) {
    return prisma.extra.findUnique({
      where: { extra_id: id }
    });
  }

  static async create(data: any) {
    return prisma.extra.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.extra.update({
      where: { extra_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.extra.delete({
      where: { extra_id: id }
    });
  }
}
