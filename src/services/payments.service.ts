import { prisma } from "../prisma/client.ts";
import { env } from "../config/env.ts";
import { paypalRequest } from "./paypal/paypalClient.ts";
import { OrderLifecycleService } from "./order/orderLifecycle.service.ts";
import { ordersService } from "./orders.service.ts";

function isPayPalConfigured() {
  return Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET);
}

function formatEur(amount: number) {
  return amount.toFixed(2);
}

export const paymentsService = {
  getConfig() {
    return {
      cardPaymentsEnabled: isPayPalConfigured(),
      paypalClientId: env.PAYPAL_CLIENT_ID ?? null,
      currency: "EUR"
    };
  },

  async createPayPalOrder(orderId: string) {
    if (!isPayPalConfigured()) {
      throw new Error("Card payments are not configured");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { item: true } } }
    });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "paid") throw new Error("Order is already paid");

    const amount = Number(order.orderTotal ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid order amount");
    }

    const result = await paypalRequest("/v2/checkout/orders", "POST", {
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: orderId,
          description: `Concordia order ${orderId.slice(0, 8)}`,
          amount: {
            currency_code: "EUR",
            value: formatEur(amount)
          }
        }
      ]
    });

    if (!result?.id) {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Failed to create PayPal order");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paypalOrderId: result.id,
        paymentMethod: "CARD"
      }
    });

    return { paypalOrderId: result.id, orderId };
  },

  async capturePayPalOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "paid") {
      return { success: true, alreadyPaid: true };
    }
    if (!order.paypalOrderId) {
      throw new Error("Missing PayPal order ID");
    }

    const result = await paypalRequest(
      `/v2/checkout/orders/${order.paypalOrderId}/capture`,
      "POST"
    );

    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture || capture.status !== "COMPLETED") {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Payment capture failed");
    }

    await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
      paidAt: new Date(),
      paypalCaptureId: capture.id,
      transactionId: capture.id
    });

    await ordersService.notifyKitchenOrder(orderId);

    return { success: true, captureId: capture.id };
  }
};
