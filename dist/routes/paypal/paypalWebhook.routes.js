import express from "express";
const { Router } = express;
import { paypalWebhookHandler } from "../../controllers/paypal/paypalWebhook.controller.js";
const router = Router();
router.post("/", paypalWebhookHandler);
export default router;
