import express from "express";
const { Router } = express;
import { LTMLController } from "../controllers/ltml.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/save",
  adminAuth,
  adminRole("manager"),
  LTMLController.save
);

router.post(
  "/trends",
  adminAuth,
  adminRole("manager"),
  LTMLController.trends
);

router.get(
  "/summary",
  adminAuth,
  adminRole("manager"),
  LTMLController.summary
);

export default router;







