import { prisma } from "../../prisma/client.js";

export class ToppingService {
  static async getAll() {
    return prisma.topping.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    return prisma.topping.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.topping.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.topping.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    return prisma.topping.delete({
      where: { id },
    });
  }
}
