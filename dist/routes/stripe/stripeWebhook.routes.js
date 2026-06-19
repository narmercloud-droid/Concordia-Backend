import express from "express";
const { Router } = express;
import { getStripe } from "../../services/stripe/stripeClient.js";
import { getStripeWebhookSecret } from "../../services/stripe/branchStripe.service.js";
import { handleStripeWebhookEvent } from "../../services/stripe/stripeWebhook.service.js";
import logger from "../../utils/logger.js";
const router = Router();
router.post("/", async (req, res) => {
    const secret = getStripeWebhookSecret();
    if (!secret) {
        return res.status(503).json({ error: "Stripe webhook not configured" });
    }
    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string") {
        return res.status(400).send("Missing stripe-signature header");
    }
    try {
        const stripe = getStripe();
        const event = stripe.webhooks.constructEvent(req.body, signature, secret);
        await handleStripeWebhookEvent(event);
        return res.json({ received: true });
    }
    catch (err) {
        logger.error({ err }, "Stripe webhook verification failed");
        return res.status(400).send(`Webhook Error: ${err?.message ?? "invalid"}`);
    }
});
export default router;
