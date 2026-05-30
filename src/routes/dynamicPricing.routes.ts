import { Router } from "express";
import { DynamicPricingController } from "../controllers/dynamicPricing.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

router.post(
  "/item",
  adminAuth,
  adminRole("manager"),
  DynamicPricingController.optimizeItem
);

router.post(
  "/branch",
  adminAuth,
  adminRole("manager"),
  DynamicPricingController.optimizeBranch
);

export default router;







