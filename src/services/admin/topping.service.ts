import { prisma } from "../../prisma/client.js";

export class ToppingService {
  static async getAll(branchId: string) {
    return prisma.topping.findMany({
      orderBy: { name: "asc" }
    });
  }

  static async getById(id: string, branchId: string) {
    return prisma.topping.findFirst({
      where: { id }
    });
  }

  static async create(branchId: string, data: any) {
    return prisma.topping.create({ data });
  }

  static async update(id: string, branchId: string, data: any) {
    return prisma.topping.update({
      where: { id },
      data
    });
  }

  static async remove(id: string, branchId: string) {
    return prisma.topping.deleteMany({
      where: { id }
    });
  }
}
