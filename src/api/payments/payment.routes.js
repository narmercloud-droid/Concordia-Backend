import express from 'express';
import { createPaymentIntent, handleStripeWebhook, markCashOnDelivery } from './payment.controller.js';

const router = express.Router();
router.post('/intent', createPaymentIntent);
router.post('/cod', markCashOnDelivery);
// Webhook should receive raw body; app.ts must mount this route with express.raw middleware
router.post('/webhook', handleStripeWebhook);

export default router;
