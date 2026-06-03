import { prisma } from "../prisma/client.js";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
export class SegmentService {
    evaluateSegment(segment, customer) {
        const filters = segment.filterJson ? JSON.parse(segment.filterJson) : {};
        const orders = customer.orders || [];
        const favorites = customer.favorites || [];
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => {
            return sum + (order.items || []).reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0);
        }, 0);
        if (filters.lastOrderDays != null) {
            if (!orders.length)
                return false;
            const lastOrder = orders.reduce((latest, order) => {
                const orderDate = new Date(order.createdAt);
                return !latest || orderDate > new Date(latest.createdAt) ? order : latest;
            }, null);
            if (!lastOrder)
                return false;
            const ageDays = Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / MS_PER_DAY);
            if (ageDays >= Number(filters.lastOrderDays))
                return false;
        }
        if (filters.totalOrders != null) {
            if (totalOrders <= Number(filters.totalOrders))
                return false;
        }
        if (filters.totalSpent != null) {
            if (totalSpent <= Number(filters.totalSpent))
                return false;
        }
        if (filters.favoriteItem) {
            const target = String(filters.favoriteItem).toLowerCase();
            const hasFavorite = favorites.some((fav) => fav.item?.name?.toLowerCase() === target);
            const hasOrdered = orders.some((order) => (order.items || []).some((item) => item.item?.name?.toLowerCase() === target));
            if (!hasFavorite && !hasOrdered)
                return false;
        }
        if (filters.marketingEmail === true && !customer.marketingEmail) {
            return false;
        }
        return true;
    }
    async getCustomersForSegment(segmentId) {
        const segment = await prisma.segment.findUnique({
            where: { id: segmentId }
        });
        if (!segment)
            return [];
        const customers = await prisma.customer.findMany({
            include: {
                orders: {
                    include: {
                        items: {
                            include: { item: true }
                        }
                    }
                },
                favorites: {
                    include: { item: true }
                }
            }
        });
        return customers.filter(customer => this.evaluateSegment(segment, customer));
    }
}
export const segmentService = new SegmentService();
