import express from "express";
const { Router } = express;
import { BehaviorPredictionController } from "../controllers/behaviorPrediction.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/profile/:customerId",
  adminAuth,
  adminRole("manager"),
  BehaviorPredictionController.profile
);

export default router;







