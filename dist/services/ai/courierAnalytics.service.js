import { prisma } from "../../prisma/client.js";
export class CourierAnalyticsService {
    /**
     * Update courier performance statistics after an order is delivered
     */
    static async updateCourierPerformance(order) {
        if (!order.courierToken || !["delivered", "completed"].includes(order.status)) {
            return; // Only update for delivered/completed orders with courier
        }
        // Get courier ID from token (simplified - in real app, decode token)
        const courierId = order.courierToken; // This would be decoded from token
        // Get existing analytics or create new
        let analytics = await prisma.courierPerformance.findUnique({
            where: { courierId }
        });
        if (!analytics) {
            analytics = await prisma.courierPerformance.create({
                data: {
                    courierId,
                    totalDeliveries: 0,
                    avgDeliveryTime: 0,
                    onTimeRate: 0,
                    ratingScore: 0
                }
            });
        }
        // Calculate delivery time (simplified - using scheduled time)
        const deliveryTime = order.scheduledFor
            ? Math.floor((new Date(order.scheduledFor).getTime() - new Date(order.createdAt).getTime()) / 60000)
            : 30; // Default 30 minutes
        // Update statistics
        const newTotalDeliveries = analytics.totalDeliveries + 1;
        const newAvgDeliveryTime = ((analytics.avgDeliveryTime * analytics.totalDeliveries) + deliveryTime) / newTotalDeliveries;
        // Calculate on-time rate (simplified - delivery within 45 minutes)
        const isOnTime = deliveryTime <= 45;
        const newOnTimeRate = ((analytics.onTimeRate * analytics.totalDeliveries) + (isOnTime ? 1 : 0)) / newTotalDeliveries;
        // Get rating from review if available
        let newRatingScore = analytics.ratingScore;
        const review = await prisma.review.findUnique({
            where: { orderId: order.id }
        });
        if (review) {
            const newTotalRatings = analytics.totalDeliveries + 1;
            newRatingScore = ((analytics.ratingScore * analytics.totalDeliveries) + review.rating) / newTotalRatings;
        }
        await prisma.courierPerformance.update({
            where: { courierId },
            data: {
                totalDeliveries: newTotalDeliveries,
                avgDeliveryTime: newAvgDeliveryTime,
                onTimeRate: newOnTimeRate,
                ratingScore: newRatingScore
            }
        });
    }
    /**
     * Calculate courier performance score
     */
    static async calculateCourierScore(courierId) {
        const analytics = await prisma.courierPerformance.findUnique({
            where: { courierId }
        });
        if (!analytics) {
            return 0;
        }
        // Weighted performance score
        const deliveryScore = Math.max(0, 1 - (analytics.avgDeliveryTime / 60)); // Normalize delivery time
        const onTimeScore = analytics.onTimeRate; // Already 0-1
        const ratingScore = analytics.ratingScore / 5; // Normalize to 0-1
        // Weighted average
        const performanceScore = (deliveryScore * 0.3) + (onTimeScore * 0.4) + (ratingScore * 0.3);
        return Math.min(1, Math.max(0, performanceScore));
    }
    /**
     * Get courier performance summary
     */
    static async getCourierPerformance(courierId) {
        return prisma.courierPerformance.findUnique({
            where: { courierId }
        });
    }
    /**
     * Get top performing couriers for a branch
     */
    static async getTopCouriers(branchId, limit = 10) {
        // Get all couriers for the branch
        const couriers = await prisma.courier.findMany({
            where: { branchId },
            include: {
                courierPerformance: true
            }
        });
        const couriersWithScores = await Promise.all(couriers.map(async (courier) => {
            const score = courier.courierPerformance
                ? await this.calculateCourierScore(courier.id)
                : 0;
            return {
                ...courier,
                performanceScore: score
            };
        }));
        return couriersWithScores
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, limit);
    }
}
