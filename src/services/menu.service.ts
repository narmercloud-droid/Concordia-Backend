import { prisma } from "../prisma/client";

export class MenuService {
  static async getFullMenu() {
    const categories = await prisma.category.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        items: {
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
        }
      }
    });

    const deals = await prisma.deal.findMany({
      orderBy: { sort_order: "asc" },
      include: {
        items_included: {
          include: { item: true }
        }
      }
    });

    return { categories, deals };
  }
}
