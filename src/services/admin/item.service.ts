import { prisma } from "../../prisma/client.js";

export class ItemService {
  static async getAll(branchId: string) {
    return prisma.menuItem.findMany({
      orderBy: { name: "asc" },
      include: {
        category: true
      }
    });
  }

  static async getById(id: string, branchId: string) {
    return prisma.menuItem.findFirst({
      where: { id },
      include: {
        category: true
      }
    });
  }

  static async create(branchId: string, data: any) {
    return prisma.menuItem.create({ data });
  }

  static async update(id: string, branchId: string, data: any) {
    return prisma.menuItem.update({
      where: { id },
      data
    });
  }

  static async remove(id: string, branchId: string) {
    return prisma.menuItem.deleteMany({
      where: { id }
    });
  }
}
