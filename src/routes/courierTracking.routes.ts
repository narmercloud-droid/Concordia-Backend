import { Router } from "express";
import { CourierTrackingController } from "../controllers/courierTracking.controller.js";
import { courierAuth } from "../middleware/courierAuth.js";
import { customerAuth } from "../middleware/customerAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

// Courier updates GPS
router.post(
  "/location",
  courierAuth,
  CourierTrackingController.updateLocation
);

// Courier or system adds tracking event
router.post(
  "/event",
  courierAuth,
  CourierTrackingController.addEvent
);

// Customer tracking screen
router.get(
  "/track/:orderId",
  customerAuth,
  CourierTrackingController.customerTracking
);

// Manager live map
router.get(
  "/manager/live-map",
  adminAuth,
  adminRole("manager"),
  CourierTrackingController.managerLiveMap
);

export default router;


