import { prisma } from "../prisma/client.js";
import { dynamicPricingService } from "./dynamicPricing.service";
import { staffingPrepService } from "./staffingPrep.service";
import { ltvChurnService } from "./ltvChurn.service";
import { forecastingService } from "./forecasting.service";
export class DecisionEngineService {
    async log(branchId, actionType, description, confidence, impact, autoApplied) {
        return prisma.decisionLog.create({
            data: { branchId, actionType, description, confidence, impact, autoApplied },
        });
    }
    // 1. Pricing decisions (branch-scoped via orderItems -> menuItem ids)
    // Performance: avoid per-item DB calls for price calculation by batching demand counts.
    async pricing(branchId) {
        const settings = await prisma.automationSettings.findUnique({ where: { branchId } });
        const orderItems = await prisma.orderItem.findMany({
            where: { order: { branchId } },
            select: { itemId: true },
            distinct: ["itemId"],
        });
        const itemIds = orderItems.map(i => i.itemId);
        if (itemIds.length === 0)
            return [];
        const items = await prisma.menuItem.findMany({
            where: { id: { in: itemIds } },
            select: { id: true, name: true, price: true, stock: true, lowStockThreshold: true },
        });
        // Batch demandFactor: orders for each item in the last hour
        const windowStart = new Date(Date.now() - 3600000);
        const demandCounts = await prisma.orderItem.groupBy({
            by: ["itemId"],
            where: {
                itemId: { in: itemIds },
                createdAt: { gte: windowStart },
            },
            _count: { itemId: true },
        });
        const demandCountByItemId = new Map(demandCounts.map(g => [g.itemId, g._count.itemId]));
        // timeFactor is identical for all items in this run
        const hour = new Date().getHours();
        const timeMultiplier = hour >= 18 && hour <= 21 ? 1.10 : hour >= 14 && hour <= 16 ? 0.95 : 1.00;
        const results = [];
        for (const item of items) {
            const demand = demandCountByItemId.get(item.id) ?? 0;
            const demandMultiplier = demand > 20 ? 1.20 : demand > 10 ? 1.10 : 1.00;
            const inventoryMultiplier = item.stock === null
                ? 1.00
                : item.lowStockThreshold === null
                    ? 1.00
                    : item.stock < item.lowStockThreshold
                        ? 1.15
                        : item.stock > 200
                            ? 0.90
                            : 1.00;
            const multiplier = demandMultiplier * inventoryMultiplier * timeMultiplier;
            const oldPrice = item.price;
            const newPrice = parseFloat((oldPrice * multiplier).toFixed(2));
            if (oldPrice !== newPrice) {
                const description = `Price change for ${item.name}: ${oldPrice} → ${newPrice}`;
                const confidence = 0.8;
                const impact = "medium";
                if (settings?.pricing) {
                    // DB writes are inherently per-item
                    await dynamicPricingService.applyPrice(item.id, "ADE auto-pricing");
                    await this.log(branchId, "pricing", description, confidence, impact, true);
                }
                else {
                    await this.log(branchId, "pricing", description, confidence, impact, false);
                }
                results.push({ itemId: item.id, oldPrice, newPrice });
            }
        }
        return results;
    }
    // 2. Inventory decisions
    // NOTE: forecastingService.forecastStock uses prisma.menuItem.findMany({ where: { branchId } })
    // which is also a Prisma mismatch. We keep the method signature for contract,
    // but this will be addressed in the inventory/schema cleanup phase.
    async inventory(branchId) {
        const forecast = await forecastingService.forecastStock(branchId);
        const results = [];
        for (const f of forecast) {
            if (f.expectedDaysUntilOut !== "N/A" && Number(f.expectedDaysUntilOut) < 2) {
                const description = `Item ${f.name} will run out in ${f.expectedDaysUntilOut} days`;
                const confidence = 0.9;
                const impact = "high";
                await this.log(branchId, "inventory", description, confidence, impact, false);
                results.push(f);
            }
        }
        return results;
    }
    // 3. Staffing decisions
    async staffing(branchId) {
        const plan = await staffingPrepService.staffingPlan(branchId);
        const alerts = plan.filter(p => p.recommendedCouriers > 5);
        for (const a of alerts) {
            await this.log(branchId, "staffing", `High courier demand expected at hour ${a.hour}`, 0.85, "high", false);
        }
        return alerts;
    }
    // 4. Retention decisions (branch-scoped via orderCustomers -> customers ids)
    async retention(branchId) {
        const orderCustomers = await prisma.order.findMany({
            where: { branchId, customerId: { not: null } },
            select: { customerId: true },
            distinct: ["customerId"],
        });
        const customerIds = orderCustomers.map(o => o.customerId).filter(Boolean);
        const customers = await prisma.customer.findMany({
            where: { id: { in: customerIds } },
            select: { id: true },
        });
        const results = [];
        for (const c of customers) {
            // IMPORTANT: churn risk must be computed from branch-scoped orders only
            const churn = await ltvChurnService.churnRisk(c.id, branchId);
            if (churn.level === "high") {
                const description = `Customer ${c.id} is at high churn risk`;
                await this.log(branchId, "retention", description, 0.75, "medium", false);
                results.push({ customerId: c.id, churn });
            }
        }
        return results;
    }
    // 5. Full decision cycle
    async run(branchId) {
        return {
            pricing: await this.pricing(branchId),
            inventory: await this.inventory(branchId),
            staffing: await this.staffing(branchId),
            retention: await this.retention(branchId),
        };
    }
}
export const decisionEngineService = new DecisionEngineService();
