import express from "express";
const { Router } = express;
import { CouriersController } from "../controllers/couriers.controller.ts";
import { courierAuth } from "../middleware/courierAuth.ts";

const router = Router();

// Courier scans QR â†’ claims order
router.post("/claim", CouriersController.claim);

// Courier updates status (picked_up, delivered)
router.post("/status", courierAuth, CouriersController.updateStatus);

export default router;







