import express from "express";
const { Router } = express;
import { OrchestrationController } from "../controllers/orchestration.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/run",
  adminAuth,
  adminRole("manager"),
  OrchestrationController.runAll
);

router.post(
  "/trigger",
  adminAuth,
  adminRole("manager"),
  OrchestrationController.trigger
);

router.get(
  "/logs",
  adminAuth,
  adminRole("manager"),
  OrchestrationController.logs
);

export default router;







