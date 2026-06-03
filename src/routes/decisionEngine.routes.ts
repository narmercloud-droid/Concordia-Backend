import express from "express";
const { Router } = express;
import { DecisionEngineController } from "../controllers/decisionEngine.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/run",
  adminAuth,
  adminRole("manager"),
  DecisionEngineController.run
);

router.get(
  "/logs",
  adminAuth,
  adminRole("manager"),
  DecisionEngineController.logs
);

export default router;







