import express from "express";
const { Router } = express;
import { FraudController } from "../controllers/fraud.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Admin-only
router.post("/score", adminAuth, adminRole("admin"), FraudController.scoreOrder);
router.get("/risk/:orderId", adminAuth, adminRole("admin"), FraudController.getRisk);
router.get("/flags", adminAuth, adminRole("admin"), FraudController.flags);
router.get("/events/:orderId", adminAuth, adminRole("admin"), FraudController.events);
export default router;
