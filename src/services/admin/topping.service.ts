import { prisma } from "../../prisma/client.ts";

export class ToppingService {
  static async getAll() {
    const db: any = prisma as any;
    return db.topping.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    const db: any = prisma as any;
    return db.topping.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    const db: any = prisma as any;
    return db.topping.create({ data });
  }

  static async update(id: string, data: any) {
    const db: any = prisma as any;
    return db.topping.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    const db: any = prisma as any;
    return db.topping.delete({
      where: { id },
    });
  }
}




