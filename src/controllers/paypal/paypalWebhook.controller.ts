import { prisma } from "../prisma/client.ts";
import { OrderLifecycleService } from "./order/orderLifecycle.service.ts";
import {
  getBranchPayPalCredentials,
  isBranchPayPalConfigured,
  listBranchPayPalWebhookIds
} from "./paypal/branchPayPal.service.ts";
import { verifyPayPalWebhookWithAnyId } from "../utils/paypalVerify.ts";

export const paypalWebhookHandler = async (req, res) => {
  try {
    const webhookIds = await listBranchPayPalWebhookIds();
    const isValid = await verifyPayPalWebhookWithAnyId(req, webhookIds);
    if (!isValid) return res.status(400).send("Invalid signature");

    const event = JSON.parse(req.body.toString());
    const type = event.event_type;
    const resource = event.resource;

    // PayPal sends custom_id = our internal orderId
    const orderId = resource.custom_id;

    if (!orderId || String(orderId).startsWith("gift:")) {
      return res.sendStatus(200);
    }

    if (type === "PAYMENT.CAPTURE.COMPLETED") {
      await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
        paidAt: new Date(),
        paypalCaptureId: resource.id,
        transactionId: resource.id
      });
    }

    if (type === "PAYMENT.CAPTURE.DENIED") {
      await OrderLifecycleService.updatePaymentStatus(orderId, "failed");
    }

    if (type === "PAYMENT.CAPTURE.REFUNDED") {
      await OrderLifecycleService.updatePaymentStatus(orderId, "REFUNDED");
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(200); // PayPal requires 2xx even on internal errors
  }
};

