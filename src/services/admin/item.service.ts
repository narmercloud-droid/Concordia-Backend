import { prisma } from "../../prisma/client";

export class ItemService {
  static async getAll() {
    return prisma.item.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        relations: {
          include: {
            variants: { include: { variant: true } },
            toppings: { include: { topping: true } },
            extras: { include: { extra: true } }
          }
        }
      }
    });
  }

  static async getById(id: number) {
    return prisma.item.findUnique({
      where: { item_id: id },
      include: {
        relations: {
          include: {
            variants: { include: { variant: true } },
            toppings: { include: { topping: true } },
            extras: { include: { extra: true } }
          }
        }
      }
    });
  }

  static async create(data: any) {
    return prisma.item.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.item.update({
      where: { item_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.item.delete({
      where: { item_id: id }
    });
  }
}
