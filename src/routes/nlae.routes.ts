import { Router } from "express";
import { NLAEController } from "../controllers/nlae.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

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







