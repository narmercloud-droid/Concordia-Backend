import { Router } from "express";
import { IntelligenceController } from "../controllers/intelligence.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

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







