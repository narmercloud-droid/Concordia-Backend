import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client.js";
import { loyaltyService } from "../services/loyalty.service.js";

export const LoyaltyController = {
  getPoints: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const points = await prisma.loyaltyPoints.findUnique({
        where: { customerId }
      });
      res.json(points || { points: 0 });
    } catch (err: unknown) {
      next(err);
    }
  },

  redeemReward: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const reward = await loyaltyService.redeemReward(customerId, req.body.rewardId);
      res.json(reward);
    } catch (err: unknown) {
      next(err);
    }
  },

  applyPromoCode: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const promo = await loyaltyService.applyPromoCode(req.body.code);
      if (!promo) return res.status(400).json({ error: "Invalid promo code" });
      res.json(promo);
    } catch (err: unknown) {
      next(err);
    }
  },

  applyReferral: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await loyaltyService.applyReferral(req.body.code, req.user.id);
      if (!success) return res.status(400).json({ error: "Invalid referral code" });
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  listRewards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rewards = await prisma.reward.findMany();
      res.json(rewards);
    } catch (err: unknown) {
      next(err);
    }
  }
};


