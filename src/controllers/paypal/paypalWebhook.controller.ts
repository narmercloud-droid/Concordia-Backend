import { prisma } from "../../prisma/client.ts";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.ts";
import { ordersService } from "../../services/orders.service.ts";
import { sendOrderConfirmationEmail } from "../../services/customer/orderConfirmationEmail.service.ts";
import { listBranchPayPalWebhookIds } from "../../services/paypal/branchPayPal.service.ts";
import { verifyPayPalWebhookWithAnyId } from "../../utils/paypalVerify.ts";
import logger from "../../logger.ts";

async function resolveOrderIdFromCaptureEvent(resource: Record<string, unknown>) {
  const customId = resource.custom_id;
  if (typeof customId === "string" && customId.trim() && !customId.startsWith("gift:")) {
    return customId.trim();
  }

  const supplementary = resource.supplementary_data;
  const relatedIds =
    supplementary &&
    typeof supplementary === "object" &&
    supplementary !== null &&
    "related_ids" in supplementary
      ? (supplementary as { related_ids?: { order_id?: unknown } }).related_ids
      : undefined;
  const paypalOrderId = relatedIds?.order_id;
  if (typeof paypalOrderId !== "string" || !paypalOrderId.trim()) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: { paypalOrderId: paypalOrderId.trim() },
    select: { id: true }
  });
  return order?.id ?? null;
}

export const paypalWebhookHandler = async (req, res) => {
  try {
    const webhookIds = await listBranchPayPalWebhookIds();
    const isValid = await verifyPayPalWebhookWithAnyId(req, webhookIds);
    if (!isValid) return res.status(400).send("Invalid signature");

    const event = JSON.parse(req.body.toString());
    const type = event.event_type;
    const resource = event.resource ?? {};

    if (type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = await resolveOrderIdFromCaptureEvent(resource);
      if (!orderId) {
        return res.sendStatus(200);
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { paymentStatus: true }
      });
      if (order?.paymentStatus === "paid") {
        return res.sendStatus(200);
      }

      await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
        paidAt: new Date(),
        paypalCaptureId: resource.id,
        transactionId: resource.id
      });
      await ordersService.notifyKitchenOrder(orderId);
      void sendOrderConfirmationEmail(orderId).catch((err) => {
        logger.warn({ err, orderId }, "Order confirmation email after PayPal webhook failed");
      });
      return res.sendStatus(200);
    }

    const orderId =
      typeof resource.custom_id === "string" ? resource.custom_id : null;

    if (!orderId || String(orderId).startsWith("gift:")) {
      return res.sendStatus(200);
    }

    if (type === "PAYMENT.CAPTURE.DENIED") {
      await OrderLifecycleService.updatePaymentStatus(orderId, "failed");
    }

    if (type === "PAYMENT.CAPTURE.REFUNDED") {
      await OrderLifecycleService.updatePaymentStatus(orderId, "refunded");
    }

    return res.sendStatus(200);
  } catch (err) {
    logger.error({ err }, "PayPal webhook processing failed");
    return res.sendStatus(500);
  }
};
