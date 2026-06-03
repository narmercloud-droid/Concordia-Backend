import express from "express";
const { Router } = express;
import { OptimizationLoopController } from "../controllers/optimizationLoop.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/run",
  adminAuth,
  adminRole("manager"),
  OptimizationLoopController.run
);

router.get(
  "/logs",
  adminAuth,
  adminRole("manager"),
  OptimizationLoopController.logs
);

export default router;







