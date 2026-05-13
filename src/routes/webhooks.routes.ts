import express, { Router } from "express";

const router = Router();

// Placeholder webhook routes. Install Stripe if webhook processing is required.
router.post("/stripe", express.raw({ type: "application/json" }), async (_req, res) => {
  res.status(501).json({ error: "Stripe webhook handling is not configured." });
});

router.post("/paypal", (_req, res) => {
  res.status(501).json({ error: "PayPal webhook handling is not configured." });
});

export default router;

