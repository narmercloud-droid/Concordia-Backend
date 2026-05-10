import { prisma } from "../../prisma/client";

export class DealService {
  static async getAll() {
    return prisma.deal.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        items_included: {
          include: { item: true }
        }
      }
    });
  }

  static async getById(id: number) {
    return prisma.deal.findUnique({
      where: { deal_id: id },
      include: {
        items_included: {
          include: { item: true }
        }
      }
    });
  }

  static async create(data: any) {
    return prisma.deal.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.deal.update({
      where: { deal_id: id },
      data
    });
  }

  static async remove(id: number) {
    return prisma.deal.delete({
      where: { deal_id: id }
    });
  }

  // Add item to deal
  static async addItem(dealId: number, itemId: number) {
    return prisma.dealItem.create({
      data: {
        deal_id: dealId,
        item_id: itemId
      }
    });
  }

  // Remove item from deal
  static async removeItem(dealId: number, itemId: number) {
    return prisma.dealItem.deleteMany({
      where: {
        deal_id: dealId,
        item_id: itemId
      }
    });
  }
}
