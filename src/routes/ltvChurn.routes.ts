import express from "express";
const { Router } = express;
import { LtvChurnController } from "../controllers/ltvChurn.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/segment/:customerId",
  adminAuth,
  adminRole("manager"),
  LtvChurnController.segment
);

router.get(
  "/branch",
  adminAuth,
  adminRole("manager"),
  LtvChurnController.branchSegments
);

export default router;







