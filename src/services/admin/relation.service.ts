import { prisma } from "../../prisma/client";

export class RelationService {
  // Get all relations for an item
  static async getItemRelations(itemId: number) {
    return prisma.item.findUnique({
      where: { item_id: itemId },
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

  // Assign variant to relation
  static async addVariant(relationId: number, variantId: number) {
    return prisma.relationVariant.create({
      data: {
        relation_id: relationId,
        variant_id: variantId
      }
    });
  }

  // Assign topping to relation
  static async addTopping(relationId: number, toppingId: number) {
    return prisma.relationTopping.create({
      data: {
        relation_id: relationId,
        topping_id: toppingId
      }
    });
  }

  // Assign extra to relation
  static async addExtra(relationId: number, extraId: number) {
    return prisma.relationExtra.create({
      data: {
        relation_id: relationId,
        extra_id: extraId
      }
    });
  }

  // Remove variant
  static async removeVariant(relationId: number, variantId: number) {
    return prisma.relationVariant.deleteMany({
      where: { relation_id: relationId, variant_id: variantId }
    });
  }

  // Remove topping
  static async removeTopping(relationId: number, toppingId: number) {
    return prisma.relationTopping.deleteMany({
      where: { relation_id: relationId, topping_id: toppingId }
    });
  }

  // Remove extra
  static async removeExtra(relationId: number, extraId: number) {
    return prisma.relationExtra.deleteMany({
      where: { relation_id: relationId, extra_id: extraId }
    });
  }
}
