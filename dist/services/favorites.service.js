import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
export class FavoritesService {
    async addFavorite(customerId, itemId) {
        return prisma.favorite.upsert({
            where: {
                customerId_itemId: { customerId, itemId }
            },
            update: {},
            create: {
                id: randomUUID(),
                customer: { connect: { id: customerId } },
                item: { connect: { id: itemId } }
            }
        });
    }
    async removeFavorite(customerId, itemId) {
        return prisma.favorite.deleteMany({
            where: { customerId, itemId }
        });
    }
    async listFavorites(customerId) {
        return prisma.favorite.findMany({
            where: { customerId },
            include: {
                item: true
            }
        });
    }
    async mostFavoritedItems() {
        return prisma.favorite.groupBy({
            by: ["itemId"],
            _count: { itemId: true },
            orderBy: { _count: { itemId: "desc" } },
            take: 20
        });
    }
}
export const favoritesService = new FavoritesService();
