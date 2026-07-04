import express from "express";
const { Router } = express;
import { NotificationsController } from "../controllers/notifications.controller.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { optionalCustomerAuth } from "../middleware/optionalCustomerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { managerAccess } from "../middleware/managerAccess.ts";
import { requireManagerPermission } from "../middleware/requireManagerPermission.ts";

const router = Router();

router.post("/push-subscribe", optionalCustomerAuth, NotificationsController.registerPush);
router.post("/push-token", optionalCustomerAuth, NotificationsController.registerPush);
router.delete("/push-subscribe", optionalCustomerAuth, NotificationsController.unregisterPush);

router.put("/preferences", customerAuth, NotificationsController.updatePreferences);

router.post(
  "/marketing/sms",
  adminAuth,
  managerAccess,
  requireManagerPermission("customers_automation"),
  NotificationsController.sendMarketingSMS
);

export default router;
