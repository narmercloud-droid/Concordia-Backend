import { prisma } from "../prisma/client.js";

export class RecommendationService {
  // 1. Popular items (fallback)
  async popularItems(branchId: string): Promise<any> {
    return prisma.orderItem.groupBy({
      by: ["itemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
      where: { order: { branchId } }
    });
  }

  // 2. Favorite-based recommendations
  async favoritesBased(customerId: string): Promise<any[]> {
    const favorites = await prisma.favorite.findMany({
      where: { customerId },
      include: { item: true }
    });

    if (favorites.length === 0) return [];

    const categories = favorites.map(f => f.item.categoryId);

    return prisma.menuItem.findMany({
      where: {
        categoryId: { in: categories },
        stock: { gt: 0 }
      },
      take: 10
    });
  }

  // 3. Collaborative filtering (users who ordered X also ordered Y)
  async collaborative(itemId: string): Promise<any> {
    const related = await prisma.orderItem.groupBy({
      by: ["itemId"],
      _count: { itemId: true },
      where: {
        order: {
          items: {
            some: { itemId }
          }
        }
      },
      orderBy: { _count: { itemId: "desc" } },
      take: 10
    });

    return related.filter(r => r.itemId !== itemId);
  }

  // 4. Content-based (similar items)
  async similarItems(itemId) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId }
    });

    if (!item) return [];

    return prisma.menuItem.findMany({
      where: {
        categoryId: item.categoryId,
        id: { not: itemId },
        stock: { gt: 0 }
      },
      take: 10
    });
  }

  // 5. Search-based recommendations
  async searchBased(customerId) {
    const lastSearch = await prisma.searchLog.findFirst({
      where: {},
      orderBy: { createdAt: "desc" }
    });

    if (!lastSearch) return [];

    return prisma.menuItem.findMany({
      where: {
        OR: [
          { name: { contains: lastSearch.query, mode: "insensitive" } },
          { description: { contains: lastSearch.query, mode: "insensitive" } }
        ],
        stock: { gt: 0 }
      },
      take: 10
    });
  }

  // 6. Main recommendation engine
  async recommend(customerId, branchId) {
    const results = [];

    const fav = await this.favoritesBased(customerId);
    if (fav.length) results.push(...fav);

    const search = await this.searchBased(customerId);
    if (search.length) results.push(...search);

    const popular = await this.popularItems(branchId);
    results.push(...popular);

    // Deduplicate by itemId
    const unique = [];
    const seen = new Set();

    for (const r of results) {
      const id = r.itemId || r.id;
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(r);
      }
    }

    return unique.slice(0, 20);
  }
}

export const recommendationService = new RecommendationService();
