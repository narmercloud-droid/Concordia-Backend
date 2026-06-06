import express from "express";
const { Router } = express;
import { NotificationsController } from "../controllers/notifications.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

// Customer preferences
router.put("/preferences", customerAuth, NotificationsController.updatePreferences);

// Marketing SMS
router.post(
  "/marketing/sms",
  adminAuth,
  adminRole("manager"),
  NotificationsController.sendMarketingSMS
);

export default router;







