import express from "express";
const { Router } = express;
import { IntelligenceController } from "../controllers/intelligence.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/summary",
  adminAuth,
  adminRole("manager"),
  IntelligenceController.summary
);

router.post(
  "/report",
  adminAuth,
  adminRole("manager"),
  IntelligenceController.report
);

router.get(
  "/logs",
  adminAuth,
  adminRole("manager"),
  IntelligenceController.logs
);

export default router;







