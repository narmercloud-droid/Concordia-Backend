import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";
import { success, fail } from "./controllerHelper.js";
export const LoyaltyController = {
    getPoints: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const points = await prisma.loyaltyPoints.findUnique({
                where: { customerId }
            });
            return success(res, points || { points: 0 });
        }
        catch (err) {
            next(err);
        }
    },
    redeemReward: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const reward = await loyaltyService.redeemReward(customerId, req.body.rewardId);
            return success(res, reward);
        }
        catch (err) {
            next(err);
        }
    },
    applyPromoCode: async (req, res, next) => {
        try {
            const promo = await loyaltyService.applyPromoCode(req.body.code);
            if (!promo)
                return fail(res, "Invalid promo code", 400);
            return success(res, promo);
        }
        catch (err) {
            next(err);
        }
    },
    applyReferral: async (req, res, next) => {
        try {
            const successRes = await loyaltyService.applyReferral(req.body.code, req.user.id);
            if (!successRes)
                return fail(res, "Invalid referral code", 400);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    },
    listRewards: async (req, res, next) => {
        try {
            const rewards = await prisma.reward.findMany();
            return success(res, rewards);
        }
        catch (err) {
            next(err);
        }
    }
};
