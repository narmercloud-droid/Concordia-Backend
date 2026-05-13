import { Router } from "express";
import { CouriersController } from "../controllers/couriers.controller.js";
import { courierAuth } from "../middleware/courierAuth.js";

const router = Router();

// Courier scans QR → claims order
router.post("/claim", CouriersController.claim);

// Courier updates status (picked_up, delivered)
router.post("/status", courierAuth, CouriersController.updateStatus);

export default router;

