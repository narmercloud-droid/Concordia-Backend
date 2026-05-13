import { prisma } from "../../prisma/client.js";

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string) {
    return prisma.category.findUnique({
      where: { id }
    });
  }

  static async create(data: any) {
    return prisma.category.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.category.update({
      where: { id },
      data
    });
  }

  static async remove(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  }
}

