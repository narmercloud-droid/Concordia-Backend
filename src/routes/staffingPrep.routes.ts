import express from "express";
const { Router } = express;
import { StaffingPrepController } from "../controllers/staffingPrep.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.get(
  "/plan",
  adminAuth,
  adminRole("manager"),
  StaffingPrepController.fullPlan
);

export default router;







