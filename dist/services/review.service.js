import { prisma } from "../prisma/client.js";
export class ReviewService {
    async submitReview(customerId, data) {
        const { orderId, rating, comment } = data;
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });
        if (!order || order.customerId !== customerId) {
            throw new Error("Invalid order");
        }
        if (order.status !== "delivered") {
            throw new Error("Order not delivered yet");
        }
        return prisma.review.create({
            data: {
                orderId,
                customerId,
                branchId: order.branchId,
                rating,
                comment
            }
        });
    }
    async updateReview(customerId, reviewId, data) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!review || review.customerId !== customerId) {
            throw new Error("Not allowed");
        }
        return prisma.review.update({
            where: { id: reviewId },
            data
        });
    }
    async deleteReview(customerId, reviewId) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!review || review.customerId !== customerId) {
            throw new Error("Not allowed");
        }
        return prisma.review.delete({
            where: { id: reviewId }
        });
    }
    async rateItem(orderItemId, rating) {
        return prisma.menuItemRating.upsert({
            where: { orderItemId },
            update: { rating },
            create: { orderItemId, rating }
        });
    }
    async branchRating(branchId) {
        return prisma.review.aggregate({
            where: { branchId },
            _avg: { rating: true }
        });
    }
    async listBranchReviews(branchId) {
        return prisma.review.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
            include: { customer: true }
        });
    }
}
export const reviewService = new ReviewService();
