import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";
import { wrap, fail } from "../contracts/api.js";
export const LoyaltyController = {
    getPoints: wrap(async (req) => {
        const customerId = req.user.id;
        const points = await prisma.loyaltyPoints.findUnique({ where: { customerId } });
        return points || { points: 0 };
    }),
    redeemReward: wrap(async (req) => {
        const customerId = req.user.id;
        const reward = await loyaltyService.redeemReward(customerId, req.body.rewardId);
        return reward;
    }),
    applyPromoCode: wrap(async (req) => {
        const promo = await loyaltyService.applyPromoCode(req.body.code);
        if (!promo)
            throw fail('INVALID_INPUT', 'Invalid promo code');
        return promo;
    }),
    applyReferral: wrap(async (req) => {
        const successRes = await loyaltyService.applyReferral(req.body.code, req.user.id);
        if (!successRes)
            throw fail('INVALID_INPUT', 'Invalid referral code');
        return { success: true };
    }),
    listRewards: wrap(async () => {
        const rewards = await prisma.reward.findMany();
        return rewards;
    })
};
