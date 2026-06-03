import express from "express";
const { Router } = express;
import { kdsAuth } from "../middleware/kdsAuth.js";
import { KdsController } from "../controllers/kds/kds.controller.js";
const router = Router();
router.get("/orders", kdsAuth, KdsController.getOrders);
router.post("/status", kdsAuth, KdsController.updateStatus);
export default router;
