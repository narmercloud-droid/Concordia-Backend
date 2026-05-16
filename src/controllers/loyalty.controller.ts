import type { AuthenticatedRequest } from "../globalTypes.js";
import { Response, NextFunction } from "express";
import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";
import { success, fail } from "./controllerHelper.js";
import {
  loyaltyRedeemSchema,
  loyaltyPromoSchema,
  loyaltyReferralSchema
} from "../validation/loyalty.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const LoyaltyController = {
  getPoints: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const points = await prisma.loyaltyPoints.findUnique({
        where: { customerId }
      });
      return success(res, points || { points: 0 }, "Points fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  redeemReward: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const parsed = loyaltyRedeemSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const reward = await loyaltyService.redeemReward(customerId, parsed.data.rewardId);
      return success(res, reward, "Reward redeemed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  applyPromoCode: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = loyaltyPromoSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const promo = await loyaltyService.applyPromoCode(parsed.data.code);
      if (!promo) return fail(res, "INVALID_PROMO", "Invalid promo code", 400);
      return success(res, promo, "Promo applied");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  applyReferral: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = loyaltyReferralSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const ok = await loyaltyService.applyReferral(parsed.data.code, req.user.id);
      if (!ok) return fail(res, "INVALID_REFERRAL", "Invalid referral code", 400);
      return success(res, { success: true }, "Referral applied");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  listRewards: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const rewards = await prisma.reward.findMany();
      return success(res, rewards, "Rewards listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
