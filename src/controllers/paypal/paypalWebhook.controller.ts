import { prisma } from "../../prisma/client.js";
import { verifyPayPalWebhook } from "../../utils/paypalVerify.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";

export const paypalWebhookHandler = async (req, res) => {
  try {
    const isValid = await verifyPayPalWebhook(req);
    if (!isValid) return res.status(400).send("Invalid signature");

    const event = JSON.parse(req.body.toString());
    const type = event.event_type;
    const resource = event.resource;

    // PayPal sends custom_id = our internal orderId
    const orderId = resource.custom_id;

    if (!orderId) {
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

