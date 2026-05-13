import { prisma } from "../prisma/client.js";
// import { notificationsService } from "./notifications.service";
export class LoyaltyService {
    // Earn points after payment
    async addPointsForOrder(order) {
        if (!order.customerId)
            return;
        const items = await prisma.orderItem.findMany({
            where: { orderId: order.id }
        });
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const points = Math.floor(total * 10); // 10 points per €1
        const record = await prisma.loyaltyPoints.upsert({
            where: { customerId: order.customerId },
            update: { points: { increment: points } },
            create: { customerId: order.customerId, points }
        });
        await notificationsService.sendOrderStatusUpdate(order, `You earned ${points} points`);
        return record;
    }
    // Redeem reward
    async redeemReward(customerId, rewardId) {
        const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
        const points = await prisma.loyaltyPoints.findUnique({ where: { customerId } });
        if (!reward || !points || points.points < reward.costPoints) {
            throw new Error("Not enough points");
        }
        await prisma.loyaltyPoints.update({
            where: { customerId },
            data: { points: { decrement: reward.costPoints } }
        });
        return reward;
    }
    // Apply promo code
    async applyPromoCode(code) {
        const promo = await prisma.promoCode.findUnique({ where: { code } });
        if (!promo)
            return null;
        if (promo.expiresAt && promo.expiresAt < new Date())
            return null;
        if (promo.maxUses && promo.usedCount >= promo.maxUses)
            return null;
        await prisma.promoCode.update({
            where: { id: promo.id },
            data: { usedCount: { increment: 1 } }
        });
        return promo;
    }
    // Referral bonus
    async applyReferral(referralCode, newCustomerId) {
        const ref = await prisma.referral.findUnique({ where: { code: referralCode } });
        if (!ref)
            return null;
        await prisma.referral.update({
            where: { id: ref.id },
            data: { referredCount: { increment: 1 } }
        });
        await prisma.loyaltyPoints.upsert({
            where: { customerId: ref.customerId },
            update: { points: { increment: 500 } },
            create: { customerId: ref.customerId, points: 500 }
        });
        await prisma.loyaltyPoints.create({
            data: { customerId: newCustomerId, points: 500 }
        });
        return true;
    }
}
export const loyaltyService = new LoyaltyService();
