import { PrismaClient } from '@prisma/client';
import { stripe } from '../../services/payments/stripe.js';
import { calculateOrderTotals } from '../../services/cart/cartPricing.service.js';

const prisma = new PrismaClient();

// CREATE STRIPE PAYMENT INTENT
export async function createPaymentIntent(req, res) {
  const { orderId } = req.body;

  const totals = await calculateOrderTotals(orderId);

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(totals.total * 100),
    currency: 'usd',
    metadata: { orderId }
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentIntentId: intent.id,
      paymentMethod: 'stripe',
      paymentStatus: 'pending'
    }
  });

  res.json({ clientSecret: intent.client_secret });
}

// CONFIRM PAYMENT (WEBHOOK)
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;

    await prisma.order.update({
      where: { id: intent.metadata.orderId },
      data: { paymentStatus: 'paid' }
    });
  }

  res.json({ received: true });
}

// CASH ON DELIVERY
export async function markCashOnDelivery(req, res) {
  const { orderId } = req.body;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentMethod: 'cod',
      paymentStatus: 'cod'
    }
  });

  res.json({ success: true });
}
