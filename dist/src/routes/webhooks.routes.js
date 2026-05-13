import express, { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../prisma/client.js";
import { notificationsService } from "../services/notifications.service.js";
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// STRIPE WEBHOOK
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;
        const orderId = intent.metadata.orderId;
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "paid" }
        });
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        await notificationsService.sendOrderStatusUpdate(order, "Payment successful");
    }
    if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object;
        const orderId = intent.metadata.orderId;
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "failed" }
        });
    }
    res.json({ received: true });
});
// PAYPAL WEBHOOK (optional future expansion)
router.post("/paypal", (req, res) => {
    res.json({ received: true });
});
export default router;
