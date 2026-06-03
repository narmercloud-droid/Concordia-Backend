import express from "express";
const { Router } = express;
import { NotificationsController } from "../controllers/notifications.controller.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Customer preferences
router.put("/preferences", customerAuth, NotificationsController.updatePreferences);
// Marketing SMS
router.post("/marketing/sms", adminAuth, adminRole("manager"), NotificationsController.sendMarketingSMS);
export default router;
