import { prisma } from "../prisma/client.js";
export class DynamicPricingService {
    // 1. Demand-based pricing
    async demandFactor(itemId) {
        const orders = await prisma.orderItem.count({
            where: { itemId, createdAt: { gte: new Date(Date.now() - 3600000) } }
        });
        if (orders > 20)
            return 1.20; // +20%
        if (orders > 10)
            return 1.10; // +10%
        return 1.00;
    }
    // 2. Inventory-based pricing
    async inventoryFactor(item) {
        if (item.stock === null)
            return 1.00;
        if (item.stock < item.lowStockThreshold)
            return 1.15; // +15%
        if (item.stock > 200)
            return 0.90; // -10%
        return 1.00;
    }
    // 3. Time-of-day pricing
    async timeFactor() {
        const hour = new Date().getHours();
        if (hour >= 18 && hour <= 21)
            return 1.10; // dinner rush
        if (hour >= 14 && hour <= 16)
            return 0.95; // slow hours
        return 1.00;
    }
    // 4. Combine factors
    async calculatePrice(itemId) {
        const item = await prisma.menuItem.findUnique({ where: { id: itemId } });
        if (!item)
            throw new Error("Item not found");
        const demand = await this.demandFactor(itemId);
        const inventory = await this.inventoryFactor(item);
        const time = await this.timeFactor();
        const multiplier = demand * inventory * time;
        const newPrice = parseFloat((item.price * multiplier).toFixed(2));
        return { oldPrice: item.price, newPrice, multiplier };
    }
    // 5. Apply price change
    async applyPrice(itemId, reason) {
        const { oldPrice, newPrice } = await this.calculatePrice(itemId);
        if (oldPrice === newPrice)
            return { oldPrice, newPrice, changed: false };
        await prisma.priceHistory.create({
            data: { itemId, oldPrice, newPrice, reason }
        });
        await prisma.menuItem.update({
            where: { id: itemId },
            data: { price: newPrice }
        });
        return { oldPrice, newPrice, changed: true };
    }
    // 6. Optimize all items in branch
    async optimizeBranch(branchId) {
        const items = await prisma.menuItem.findMany({ where: { branchId } });
        const results = [];
        for (const item of items) {
            const result = await this.applyPrice(item.id, "AI dynamic pricing");
            results.push({ itemId: item.id, ...result });
        }
        return results;
    }
}
export const dynamicPricingService = new DynamicPricingService();
