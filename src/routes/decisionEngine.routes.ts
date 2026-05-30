import { Router } from "express";
import { DecisionEngineController } from "../controllers/decisionEngine.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

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







