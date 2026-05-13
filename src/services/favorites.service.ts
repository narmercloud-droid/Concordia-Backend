import { prisma } from "../prisma/client.js";

export class FavoritesService {
  async addFavorite(customerId: string, itemId: string): Promise<any> {
    return prisma.favorite.upsert({
      where: {
        customerId_itemId: { customerId, itemId }
      },
      update: {},
      create: { customerId, itemId }
    });
  }

  async removeFavorite(customerId: string, itemId: string): Promise<any> {
    return prisma.favorite.deleteMany({
      where: { customerId, itemId }
    });
  }

  async listFavorites(customerId: string): Promise<any[]> {
    return prisma.favorite.findMany({
      where: { customerId },
      include: {
        item: true
      }
    });
  }

  async mostFavoritedItems(): Promise<any> {
    return prisma.favorite.groupBy({
      by: ["itemId"],
      _count: { itemId: true },
      orderBy: { _count: { itemId: "desc" } },
      take: 20
    });
  }
}

export const favoritesService = new FavoritesService();
