import { prisma } from "../prisma/client.js";
export class MenuOptimizationService {
    // 1. Underperforming items
    async underperforming(branchId) {
        // Get items that have been ordered from this branch
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    branchId: branchId
                }
            },
            include: {
                order: {
                    include: {
                        Review: true
                    }
                }
            }
        });
        // Get all menu items
        const menuItems = await prisma.menuItem.findMany();
        const menuItemMap = new Map(menuItems.map(item => [item.id, item]));
        // Group by item and calculate metrics
        const itemStats = new Map();
        orderItems.forEach(oi => {
            const item = menuItemMap.get(oi.itemId);
            if (!item)
                return;
            const existing = itemStats.get(item.id) || {
                id: item.id,
                name: item.name,
                orderCount: 0,
                totalRating: 0,
                ratingCount: 0
            };
            existing.orderCount++;
            if (oi.order.Review) {
                existing.totalRating += oi.order.Review.rating;
                existing.ratingCount++;
            }
            itemStats.set(item.id, existing);
        });
        return Array.from(itemStats.values())
            .filter(i => i.orderCount < 10 || (i.ratingCount > 0 && i.totalRating / i.ratingCount < 3))
            .map(i => ({
            id: i.id,
            name: i.name,
            reason: "Low sales or low rating"
        }));
    }
    // 2. High-performing items
    async highPerforming(branchId) {
        // Get items that have been ordered from this branch
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    branchId: branchId
                }
            }
        });
        // Get all menu items
        const menuItems = await prisma.menuItem.findMany();
        const menuItemMap = new Map(menuItems.map(item => [item.id, item]));
        // Group by item and count orders
        const itemStats = new Map();
        orderItems.forEach(oi => {
            const item = menuItemMap.get(oi.itemId);
            if (!item)
                return;
            const existing = itemStats.get(item.id) || {
                id: item.id,
                name: item.name,
                orderCount: 0
            };
            existing.orderCount++;
            itemStats.set(item.id, existing);
        });
        return Array.from(itemStats.values())
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, 10)
            .map(i => ({
            id: i.id,
            name: i.name,
            orderCount: i.orderCount
        }));
    }
    // 3. Price optimization suggestions
    async priceOptimization(branchId) {
        // Get items that have been ordered from this branch
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: {
                    branchId: branchId
                }
            }
        });
        // Get all menu items
        const menuItems = await prisma.menuItem.findMany();
        const menuItemMap = new Map(menuItems.map(item => [item.id, item]));
        // Group by item and count orders
        const itemStats = new Map();
        orderItems.forEach(oi => {
            const item = menuItemMap.get(oi.itemId);
            if (!item)
                return;
            const existing = itemStats.get(item.id) || {
                id: item.id,
                name: item.name,
                orderCount: 0
            };
            existing.orderCount++;
            itemStats.set(item.id, existing);
        });
        return Array.from(itemStats.values())
            .filter(i => i.orderCount > 50)
            .map(i => ({
            id: i.id,
            name: i.name,
            suggestion: "Consider raising price by 5%"
        }));
    }
    // 4. Search-to-order conversion
    async searchConversion(branchId) {
        const searches = await prisma.searchLog.groupBy({
            by: ["query"],
            _count: { query: true }
        });
        const items = await prisma.menuItem.findMany();
        const results = [];
        for (const s of searches) {
            const matchingItem = items.find(i => i.name.toLowerCase().includes(s.query.toLowerCase()));
            if (matchingItem) {
                results.push({
                    query: s.query,
                    itemName: matchingItem.name,
                    searchCount: s._count.query
                });
            }
        }
        return results;
    }
    // 5. Inventory insights
    async inventoryInsights(branchId) {
        const items = await prisma.menuItem.findMany();
        // Get favorites count for each item
        const favoritesCounts = await Promise.all(items.map(async (item) => {
            const count = await prisma.favorite.count({
                where: { itemId: item.id }
            });
            return { itemId: item.id, count };
        }));
        const favoritesMap = new Map(favoritesCounts.map(f => [f.itemId, f.count]));
        return items
            .filter(i => i.stock !== null && i.stock < (i.lowStockThreshold || 5))
            .map(i => ({
            id: i.id,
            name: i.name,
            currentStock: i.stock,
            popularity: favoritesMap.get(i.id) || 0
        }));
    }
    // 6. Full optimization report
    async optimize(branchId) {
        return {
            underperforming: await this.underperforming(branchId),
            highPerforming: await this.highPerforming(branchId),
            priceOptimization: await this.priceOptimization(branchId),
            searchConversion: await this.searchConversion(branchId),
            inventoryInsights: await this.inventoryInsights(branchId)
        };
    }
}
export const menuOptimizationService = new MenuOptimizationService();
