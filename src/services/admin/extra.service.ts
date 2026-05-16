import { prisma } from "../../prisma/client.js";

export class ExtraService {
  static async getAll() {
    return prisma.extra.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    return prisma.extra.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.extra.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.extra.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.extra.delete({
      where: { id },
    });
  }
}
