import express from "express";
const { Router } = express;
import { PaymentsController } from "../controllers/payments.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { requireSuperAdmin } from "../middleware/requireSuperAdmin.ts";
import { branchPaymentAccess } from "../middleware/branchPaymentAccess.ts";
import { optionalCustomerAuth } from "../middleware/optionalCustomerAuth.ts";

const router = Router();

router.get("/config", PaymentsController.getConfig);

router.post(
  "/stripe/create-intent",
  optionalCustomerAuth,
  PaymentsController.createStripePaymentIntent
);
router.post("/stripe/confirm", PaymentsController.confirmStripePayment);
router.post("/gift-card/stripe/create-intent", PaymentsController.createGiftCardStripePaymentIntent);
router.post("/gift-card/stripe/confirm", PaymentsController.confirmGiftCardStripePayment);

router.post("/paypal/create-order", PaymentsController.createPayPalOrder);
router.post("/paypal/capture", PaymentsController.capturePayPalOrder);
router.post("/gift-card/paypal/create-order", PaymentsController.createGiftCardPayPalOrder);
router.post("/gift-card/paypal/capture", PaymentsController.captureGiftCardPayPalOrder);

router.get(
  "/branches/:branchId/status",
  adminAuth,
  branchPaymentAccess,
  PaymentsController.getBranchPaymentStatus
);
router.post(
  "/branches/:branchId/onboarding",
  adminAuth,
  branchPaymentAccess,
  PaymentsController.createBranchOnboardingLink
);
router.put(
  "/branches/:branchId/settings",
  adminAuth,
  requireSuperAdmin,
  PaymentsController.updateBranchPaymentSettings
);

export default router;
