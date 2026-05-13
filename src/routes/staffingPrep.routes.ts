import { Router } from "express";
import { StaffingPrepController } from "../controllers/staffingPrep.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

router.get(
  "/plan",
  adminAuth,
  adminRole("manager"),
  StaffingPrepController.fullPlan
);

export default router;

