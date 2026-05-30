import { prisma } from "../../prisma/client.js";

export class ExtraService {
  static async getAll() {
    const db: any = prisma as any;
    return db.extra.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    const db: any = prisma as any;
    return db.extra.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    const db: any = prisma as any;
    return db.extra.create({ data });
  }

  static async update(id: string, data: any) {
    const db: any = prisma as any;
    return db.extra.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    const db: any = prisma as any;
    return db.extra.delete({
      where: { id },
    });
  }
}




