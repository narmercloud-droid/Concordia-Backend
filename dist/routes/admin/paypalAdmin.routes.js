import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { capturePayPalPayment } from "../../controllers/paypal/paypalCapture.controller.js";
import { refundPayPalPayment } from "../../controllers/paypal/paypalRefund.controller.js";
const router = Router();
router.post("/capture", adminAuth, capturePayPalPayment);
router.post("/refund", adminAuth, refundPayPalPayment);
export default router;
