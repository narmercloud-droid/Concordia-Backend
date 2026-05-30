import { Router } from "express";
import { MenuOptimizationController } from "../controllers/menuOptimization.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

router.get(
  "/optimize",
  adminAuth,
  adminRole("manager"),
  MenuOptimizationController.optimize
);

export default router;







