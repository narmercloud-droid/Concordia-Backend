import { prisma } from "../../prisma/client";

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany({
      orderBy: { sort_order: "asc" }
    });
  }

  static async getById(id: number) {
    return prisma.category.findUnique({
      where: { category_id: id }
    });
  }

  static async create(data: any) {
    return prisma.category.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.category.update({
      where: { category_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.category.delete({
      where: { category_id: id }
    });
  }
}
