import { prisma } from "../prisma/client.js";

export class SearchService {
  async searchMenu(query: string, customerId?: string): Promise<any[]> {
    const items = await prisma.menuItem.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } }
        ]
      },
      include: {
        favorites: customerId ? {
          where: { customerId }
        } : false
      }
    });

    return items;
  }

  async searchBranches(query: string): Promise<any[]> {
    return prisma.branch.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { cuisine: { contains: query, mode: "insensitive" } }
        ]
      }
    });
  }

  async searchCategories(query: string): Promise<any[]> {
    return prisma.category.findMany({
      where: {
        name: { contains: query, mode: "insensitive" }
      }
    });
  }

  async recordSearch(query: string): Promise<any> {
    return prisma.searchLog.create({
      data: { query }
    });
  }

  async topSearches(): Promise<any> {
    return prisma.searchLog.groupBy({
      by: ["query"],
      _count: { query: true },
      orderBy: { _count: { query: "desc" } },
      take: 20
    });
  }
}

export const searchService = new SearchService();
