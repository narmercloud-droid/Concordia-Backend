import express from "express";
const { Router } = express;
import { PaymentsController } from "../controllers/payments.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";

const router = Router();

// Stripe
router.post("/stripe/create-intent", PaymentsController.createStripeIntent);

// PayPal
router.post("/paypal/create-order", PaymentsController.createPayPalOrder);
router.post("/paypal/capture", PaymentsController.capturePayPalOrder);

// Refunds
router.post("/refund/:id", adminAuth, adminRole("manager"), PaymentsController.refund);

export default router;







