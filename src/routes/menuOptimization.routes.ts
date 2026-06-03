import express from "express";
const { Router } = express;
import { MenuOptimizationController } from "../controllers/menuOptimization.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/optimize",
  adminAuth,
  adminRole("manager"),
  MenuOptimizationController.optimize
);

export default router;







