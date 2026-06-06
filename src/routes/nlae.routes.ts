import express from "express";
const { Router } = express;
import { NLAEController } from "../controllers/nlae.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

router.post(
  "/ask",
  adminAuth,
  adminRole("manager"),
  NLAEController.ask
);

router.get(
  "/history",
  adminAuth,
  adminRole("manager"),
  NLAEController.history
);

export default router;







