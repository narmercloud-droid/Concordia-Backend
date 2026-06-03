import express from "express";
const { Router } = express;
import { DynamicPricingController } from "../controllers/dynamicPricing.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

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







