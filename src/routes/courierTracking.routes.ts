import express from "express";
const { Router } = express;
import { CourierTrackingController } from "../controllers/courierTracking.controller.ts";
import { courierAuth } from "../middleware/courierAuth.ts";
import { customerAuth } from "../middleware/customerAuth.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

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








