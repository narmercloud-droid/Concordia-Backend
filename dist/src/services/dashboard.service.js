import { prisma } from "../prisma/client.js";
export class DashboardService {
    async globalRevenue() {
        return prisma.order.count({
            where: { paymentStatus: "paid" }
        });
    }
    async branchRevenue(branchId) {
        return prisma.order.count({
            where: { branchId, paymentStatus: "paid" }
        });
    }
    async globalOrders() {
        return prisma.order.count();
    }
    async branchOrders(branchId) {
        return prisma.order.count({ where: { branchId } });
    }
    async menuPerformance(branchId) {
        return prisma.orderItem.findMany({
            where: branchId ? { order: { branchId } } : undefined,
            select: {
                itemId: true,
                quantity: true
            },
            orderBy: { quantity: "desc" }
        });
    }
    async courierPerformance(branchId) {
        return prisma.order.findMany({
            where: branchId ? { branchId } : undefined,
            select: {
                courierStatus: true,
                id: true
            }
        });
    }
    async topSearches() {
        return prisma.searchLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });
    }
    async loyaltyStats() {
        return prisma.loyaltyPoints.aggregate({
            _sum: { points: true },
            _avg: { points: true }
        });
    }
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
