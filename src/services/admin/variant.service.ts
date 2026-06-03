import { prisma } from "../../prisma/client.ts";

export class VariantService {
  static async getAll() {
    const db: any = prisma as any;
    return db.variant.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    const db: any = prisma as any;
    return db.variant.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    const db: any = prisma as any;
    return db.variant.create({ data });
  }

  static async update(id: string, data: any) {
    const db: any = prisma as any;
    return db.variant.update({
      where: { id },
      data,
    });
  }

  static async remove(id: string) {
    const db: any = prisma as any;
    return db.variant.delete({
      where: { id },
    });
  }
}




