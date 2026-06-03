import express from "express";
const { Router } = express;
import { LoyaltyController } from "../controllers/loyalty.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";
import { prisma } from "../prisma/client.ts";

const router = Router();

// Customer
router.get("/points", customerAuth, LoyaltyController.getPoints);
router.post("/redeem", customerAuth, LoyaltyController.redeemReward);
router.post("/promo", customerAuth, LoyaltyController.applyPromoCode);
router.post("/referral", customerAuth, LoyaltyController.applyReferral);
router.get("/rewards", LoyaltyController.listRewards);

// Manager
router.post("/rewards", adminAuth, adminRole("manager"), async (req, res) => {
  const reward = await prisma.reward.create({ data: req.body });
  res.tson(reward);
});

router.post("/promo", adminAuth, adminRole("manager"), async (req, res) => {
  const promo = await prisma.promoCode.create({ data: req.body });
  res.tson(promo);
});

export default router;








