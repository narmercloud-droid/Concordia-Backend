import { Router } from "express";
import { BehaviorPredictionController } from "../controllers/behaviorPrediction.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

router.get(
  "/profile/:customerId",
  adminAuth,
  adminRole("manager"),
  BehaviorPredictionController.profile
);

export default router;

