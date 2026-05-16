import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";
export const LoyaltyController = {
    getPoints: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const points = await prisma.loyaltyPoints.findUnique({
                where: { customerId }
            });
            res.json(points || { points: 0 });
        }
        catch (err) {
            next(err);
        }
    },
    redeemReward: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const reward = await loyaltyService.redeemReward(customerId, req.body.rewardId);
            res.json(reward);
        }
        catch (err) {
            next(err);
        }
    },
    applyPromoCode: async (req, res, next) => {
        try {
            const promo = await loyaltyService.applyPromoCode(req.body.code);
            if (!promo)
                return res.status(400).json({ error: "Invalid promo code" });
            res.json(promo);
        }
        catch (err) {
            next(err);
        }
    },
    applyReferral: async (req, res, next) => {
        try {
            const success = await loyaltyService.applyReferral(req.body.code, req.user.id);
            if (!success)
                return res.status(400).json({ error: "Invalid referral code" });
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    },
    listRewards: async (req, res, next) => {
        try {
            const rewards = await prisma.reward.findMany();
            res.json(rewards);
        }
        catch (err) {
            next(err);
        }
    }
};
