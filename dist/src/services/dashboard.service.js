import { prisma } from "../prisma/client.js";
export class DashboardService {
    // GLOBAL REVENUE
    async globalRevenue() {
        return prisma.order.aggregate({
            where: { paymentStatus: "paid" },
            _sum: { total: true }
        });
    }
    // BRANCH REVENUE
    async branchRevenue(branchId) {
        return prisma.order.aggregate({
            where: { branchId, paymentStatus: "paid" },
            _sum: { total: true }
        });
    }
    // GLOBAL ORDER COUNT
    async globalOrders() {
        return prisma.order.count();
    }
    // BRANCH ORDER COUNT
    async branchOrders(branchId) {
        return prisma.order.count({ where: { branchId } });
    }
    // MENU PERFORMANCE
    async menuPerformance(branchId) {
        return prisma.orderItem.groupBy({
            by: ["itemId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            where: branchId ? { order: { branchId } } : {}
        });
    }
    // COURIER PERFORMANCE
    async courierPerformance(branchId) {
        return prisma.order.groupBy({
            by: ["courierId"],
            _count: { id: true },
            where: branchId ? { branchId } : {}
        });
    }
    // SEARCH ANALYTICS
    async topSearches() {
        return prisma.searchLog.groupBy({
            by: ["query"],
            _count: { query: true },
            orderBy: { _count: { query: "desc" } },
            take: 20
        });
    }
    // LOYALTY ANALYTICS
    async loyaltyStats() {
        return prisma.loyaltyPoints.aggregate({
            _sum: { points: true },
            _avg: { points: true }
        });
    }
    // CUSTOMER ANALYTICS
    async customerStats() {
        const total = await prisma.customer.count();
        const active = await prisma.customer.count({
            where: {
                orders: { some: {} }
            }
        });
        return { total, active, inactive: total - active };
    }
}
export const dashboardService = new DashboardService();
