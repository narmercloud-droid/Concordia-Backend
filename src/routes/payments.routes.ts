import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

// Stripe
router.post("/stripe/create-intent", PaymentsController.createStripeIntent);

// PayPal
router.post("/paypal/create-order", PaymentsController.createPayPalOrder);
router.post("/paypal/capture", PaymentsController.capturePayPalOrder);

// Refunds
router.post("/refund/:id", adminAuth, adminRole("manager"), PaymentsController.refund);

export default router;







