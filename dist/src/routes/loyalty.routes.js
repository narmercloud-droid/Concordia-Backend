import { Router } from "express";
import { LoyaltyController } from "../controllers/loyalty.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { prisma } from "../prisma/client.js";
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
    res.json(reward);
});
router.post("/promo", adminAuth, adminRole("manager"), async (req, res) => {
    const promo = await prisma.promoCode.create({ data: req.body });
    res.json(promo);
});
export default router;
