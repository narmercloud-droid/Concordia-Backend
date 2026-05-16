import { Router } from "express";
import { LoyaltyController } from "../controllers/loyalty.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "../controllers/controllerHelper.js";
import { loyaltyPromoCreateSchema, loyaltyRewardCreateSchema } from "../validation/loyalty.schema.js";
const router = Router();
router.get("/points", customerAuth, LoyaltyController.getPoints);
router.post("/redeem", customerAuth, LoyaltyController.redeemReward);
router.post("/promo", customerAuth, LoyaltyController.applyPromoCode);
router.post("/referral", customerAuth, LoyaltyController.applyReferral);
router.get("/rewards", LoyaltyController.listRewards);
router.post("/rewards", adminAuth, adminRole("manager"), async (req, res) => {
    try {
        const parsed = loyaltyRewardCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return fail(res, "INVALID_INPUT", parsed.error.message, 400);
        }
        const reward = await prisma.reward.create({ data: parsed.data });
        return success(res, reward, "Reward created", 201);
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
router.post("/promo", adminAuth, adminRole("manager"), async (req, res) => {
    try {
        const parsed = loyaltyPromoCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return fail(res, "INVALID_INPUT", parsed.error.message, 400);
        }
        const promo = await prisma.promoCode.create({ data: parsed.data });
        return success(res, promo, "Promo code created", 201);
    }
    catch (err) {
        return fail(res, "UNKNOWN_ERROR", err.message, 500);
    }
});
export default router;
