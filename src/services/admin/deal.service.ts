import { prisma } from "../../prisma/client.js";

export class DealService {
  static async getAll() {
    const db: any = prisma as any;
    return db.deal.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    const db: any = prisma as any;
    return db.deal.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    const db: any = prisma as any;
    return db.deal.create({ data });
  }

  static async update(id: string, data: any) {
    const db: any = prisma as any;
    return db.deal.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    const db: any = prisma as any;
    return db.deal.delete({
      where: { id },
    });
  }
}




