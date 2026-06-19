import logger from "../../logger.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
import { ordersService } from "../orders.service.js";
import { activateGiftCardAfterPayment } from "../customer/giftCard.service.js";
async function handlePaymentIntentSucceeded(paymentIntent) {
    const type = paymentIntent.metadata?.type;
    const orderId = paymentIntent.metadata?.orderId;
    const purchaseId = paymentIntent.metadata?.purchaseId;
    if (type === "order" && orderId) {
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
    logger.warn({ paymentIntentId: paymentIntent.id, type, orderId, purchaseId }, "Stripe payment succeeded without known metadata");
}
export async function handleStripeWebhookEvent(event) {
    switch (event.type) {
        case "payment_intent.succeeded":
            await handlePaymentIntentSucceeded(event.data.object);
            break;
        case "account.updated":
            // Status sync happens on config reads; no action required here.
            break;
        default:
            break;
    }
}
