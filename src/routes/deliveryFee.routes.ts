import { Router } from "express";
import { DeliveryFeeController } from "../controllers/deliveryFee.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { customerAuth } from "../middleware/customerAuth.js";

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







