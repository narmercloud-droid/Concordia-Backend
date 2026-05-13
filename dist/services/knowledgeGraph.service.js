import { prisma } from "../prisma/client.js";
export class KnowledgeGraphService {
    // 1. Build graph nodes (branch-scoped)
    async buildNodes(branchId) {
        const orderCustomers = await prisma.order.findMany({
            where: { branchId, customerId: { not: null } },
            select: { customerId: true },
            distinct: ["customerId"],
        });
        const customerIds = orderCustomers.map(o => o.customerId).filter(Boolean);
        const customers = await prisma.customer.findMany({
            where: { id: { in: customerIds } },
        });
        const orders = await prisma.order.findMany({
            where: { branchId },
            select: { id: true, customerId: true, branchId: true },
        });
        // Derive itemIds from branch orders (because MenuItem has no branchId in schema)
        const orderItems = await prisma.orderItem.findMany({
            where: { order: { branchId } },
            select: { itemId: true },
            distinct: ["itemId"],
        });
        const itemIds = orderItems.map(i => i.itemId);
        const items = await prisma.menuItem.findMany({
            where: { id: { in: itemIds } },
        });
        // Schema has no courier<->branch field; keep empty to avoid cross-branch leakage.
        const couriers = [];
        return { customers, orders, items, couriers };
    }
    // 2. Build graph edges (relationships) (branch-scoped)
    async buildEdges(branchId) {
        const orderItems = await prisma.orderItem.findMany({
            where: { order: { branchId } },
            include: { order: true },
        });
        return orderItems.map(oi => ({
            customerId: oi.order.customerId,
            orderId: oi.orderId,
            itemId: oi.itemId,
        }));
    }
    // 3. Generate insights (branch-scoped by applying branch filter to order counts)
    async generateInsights(branchId) {
        const insights = [];
        // SearchLog has no branchId in schema, so we can't fully scope by branch here.
        // Branch scoping is applied when counting orders for each item.
        const searchLogs = await prisma.searchLog.groupBy({
            by: ["query"],
            _count: { query: true },
        });
        // Batch menu item lookup (avoid per-searchLog findFirst N+1)
        const menuItems = await prisma.menuItem.findMany({
            select: { id: true, name: true },
        });
        // Resolve which menu item(s) each search query maps to (in-memory)
        const queryToItemIds = new Map();
        for (const s of searchLogs) {
            const q = s.query;
            const matched = menuItems
                .filter(mi => mi.name.toLowerCase().includes(q.toLowerCase()))
                .map(mi => mi.id);
            if (matched.length > 0)
                queryToItemIds.set(q, matched);
        }
        // Precompute orderItem counts for all matched itemIds for this branch in one query
        const allMatchedItemIds = Array.from(new Set(Array.from(queryToItemIds.values()).flat()));
        const orderItemCounts = allMatchedItemIds.length
            ? await prisma.orderItem.groupBy({
                by: ["itemId"],
                where: { itemId: { in: allMatchedItemIds }, order: { branchId } },
                _count: { itemId: true },
            })
            : [];
        const orderCountByItemId = new Map(orderItemCounts.map(g => [g.itemId, g._count.itemId]));
        for (const s of searchLogs) {
            const itemIds = queryToItemIds.get(s.query) ?? [];
            if (itemIds.length === 0)
                continue;
            // For stability + to keep existing description wording,
            // use the first matched menu item as "match".
            const firstItemId = itemIds[0];
            const matchName = menuItems.find(mi => mi.id === firstItemId)?.name ?? "item";
            const orderCount = orderCountByItemId.get(firstItemId) ?? 0;
            if (orderCount < 3 && s._count.query > 10) {
                insights.push({
                    type: "pattern",
                    description: `High search but low orders for ${matchName}`,
                    confidence: 0.8,
                    impact: "medium",
                });
            }
        }
        // Anomaly: sudden drop in orders (branch-scoped)
        const lastWeek = await prisma.order.count({
            where: {
                branchId,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
            },
        });
        const prevWeek = await prisma.order.count({
            where: {
                branchId,
                createdAt: {
                    gte: new Date(Date.now() - 14 * 24 * 3600 * 1000),
                    lt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
                },
            },
        });
        if (prevWeek > 0 && lastWeek < prevWeek * 0.6) {
            insights.push({
                type: "anomaly",
                description: "Sudden drop in weekly orders",
                confidence: 0.9,
                impact: "high",
            });
        }
        return insights;
    }
    // 4. Save insights
    async saveInsights(branchId, insights) {
        for (const i of insights) {
            await prisma.insightLog.create({
                data: {
                    branchId,
                    type: i.type,
                    description: i.description,
                    confidence: i.confidence,
                    impact: i.impact,
                },
            });
        }
    }
    // 5. Full graph + insights
    async analyze(branchId) {
        const nodes = await this.buildNodes(branchId);
        const edges = await this.buildEdges(branchId);
        const insights = await this.generateInsights(branchId);
        await this.saveInsights(branchId, insights);
        return { nodes, edges, insights };
    }
}
export const knowledgeGraphService = new KnowledgeGraphService();
