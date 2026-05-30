import type { AuthenticatedRequest } from "../globalTypes.js";
import type { Response, NextFunction  } from "express";
import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";
import { success, fail } from "./controllerHelper.js";

export const LoyaltyController = {
  getPoints: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const points = await prisma.loyaltyPoints.findUnique({
        where: { customerId }
      });
      return success(res, points || { points: 0 });
    } catch (err: unknown) {
      next(err);
    }
  },

  redeemReward: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const reward = await loyaltyService.redeemReward(customerId, req.body.rewardId);
      return success(res, reward);
    } catch (err: unknown) {
      next(err);
    }
  },

  applyPromoCode: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const promo = await loyaltyService.applyPromoCode(req.body.code);
      if (!promo) return fail(res, "Invalid promo code", 400);
      return success(res, promo);
    } catch (err: unknown) {
      next(err);
    }
  },

  applyReferral: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const successRes = await loyaltyService.applyReferral(req.body.code, req.user.id);
      if (!successRes) return fail(res, "Invalid referral code", 400);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  listRewards: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const rewards = await prisma.reward.findMany();
      return success(res, rewards);
    } catch (err: unknown) {
      next(err);
    }
  }
};







