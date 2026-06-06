import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { capturePayPalPayment } from "../../controllers/paypal/paypalCapture.controller.ts";
import { refundPayPalPayment } from "../../controllers/paypal/paypalRefund.controller.ts";

const router = Router();

router.post("/capture", adminAuth, capturePayPalPayment);
router.post("/refund", adminAuth, refundPayPalPayment);

export default router;

