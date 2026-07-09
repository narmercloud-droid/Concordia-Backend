import type Stripe from "stripe";
import logger from "../../logger.ts";
import { prisma } from "../../prisma/client.ts";
import { OrderLifecycleService } from "../order/orderLifecycle.service.ts";
import { ordersService } from "../orders.service.ts";
import { activateGiftCardAfterPayment } from "../customer/giftCard.service.ts";

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const type = paymentIntent.metadata?.type;
  const orderId = paymentIntent.metadata?.orderId;
  const purchaseId = paymentIntent.metadata?.purchaseId;

  if (type === "order" && orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { paymentStatus: true }
    });
    if (order?.paymentStatus === "paid") {
      return;
    }

    await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
      paidAt: new Date(),
      transactionId: paymentIntent.id
    });
    await ordersService.notifyKitchenOrder(orderId);
    return;
  }

  if (type === "gift_card" && purchaseId) {
    await activateGiftCardAfterPayment(purchaseId, paymentIntent.id);
    return;
  }

  logger.warn(
    { paymentIntentId: paymentIntent.id, type, orderId, purchaseId },
    "Stripe payment succeeded without known metadata"
  );
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case "account.updated":
      // Status sync happens on config reads; no action required here.
      break;
    default:
      break;
  }
}
