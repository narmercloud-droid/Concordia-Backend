import { prisma } from "../../prisma/client";

export class ToppingService {
  static async getAll() {
    return prisma.topping.findMany({
      orderBy: { sort_order: "asc" }
    });
  }

  static async getById(id: number) {
    return prisma.topping.findUnique({
      where: { topping_id: id }
    });
  }

  static async create(data: any) {
    return prisma.topping.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.topping.update({
      where: { topping_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.topping.delete({
      where: { topping_id: id }
    });
  }
}
