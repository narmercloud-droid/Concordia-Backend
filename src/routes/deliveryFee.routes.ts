import express from "express";
const { Router } = express;
import { DeliveryFeeController } from "../controllers/deliveryFee.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";
import { customerAuth } from "../middleware/customerAuth.ts";

const router = Router();

// Customer
router.post("/calculate", customerAuth, DeliveryFeeController.calculate);

// Manager
router.put(
  "/zone/:branchId",
  adminAuth,
  adminRole("manager"),
  DeliveryFeeController.setZone
);

router.get(
  "/zone/:branchId",
  adminAuth,
  adminRole("manager"),
  DeliveryFeeController.getZone
);

export default router;







