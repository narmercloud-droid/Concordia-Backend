import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
export class SearchService {
    async searchMenu(query, customerId) {
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
    async searchBranches(query) {
        return prisma.branch.findMany({
            where: {
                name: { contains: query, mode: "insensitive" }
            }
        });
    }
    async searchCategories(query) {
        return prisma.category.findMany({
            where: {
                name: { contains: query, mode: "insensitive" }
            }
        });
    }
    async recordSearch(query) {
        return prisma.searchLog.create({
            data: {
                id: randomUUID(),
                query
            }
        });
    }
    async topSearches() {
        return prisma.searchLog.groupBy({
            by: ["query"],
            _count: { query: true },
            orderBy: { _count: { query: "desc" } },
            take: 20
        });
    }
}
export const searchService = new SearchService();
