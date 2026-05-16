import { prisma } from "../../prisma/client.js";

export class ItemService {
  static async getAll() {
    return prisma.menuItem.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    return prisma.menuItem.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.menuItem.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.menuItem.delete({
      where: { id },
    });
  }
}
