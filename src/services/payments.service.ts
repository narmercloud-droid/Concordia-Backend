import { prisma } from "../prisma/client.ts";
import { paypalRequest } from "./paypal/paypalClient.ts";
import {
  getBranchPayPalCredentials,
  isBranchPayPalConfigured,
  isPayPalModeLive,
  type BranchPayPalCredentials
} from "./paypal/branchPayPal.service.ts";
import { OrderLifecycleService } from "./order/orderLifecycle.service.ts";
import { ordersService } from "./orders.service.ts";
import {
  activateGiftCardAfterPayment,
  getGiftCardPurchase
} from "./customer/giftCard.service.ts";
import {
  confirmStripePaymentIntent,
  createGiftCardStripePaymentIntent,
  createOrderStripePaymentIntent,
  getBranchPaymentPublic
} from "./stripe/branchStripe.service.ts";
import { getStripePublishableKey, isStripeConfigured } from "./stripe/stripeClient.ts";
import { sendGiftCardConfirmationEmail, sendOrderConfirmationEmail } from "./customer/orderConfirmationEmail.service.ts";
import logger from "../logger.ts";

function formatEur(amount: number) {
  return amount.toFixed(2);
}

function buildPayPalOrderBody(
  orderId: string,
  description: string,
  amount: number,
  fulfillmentType?: string | null
) {
  const isPickup = fulfillmentType === "pickup";
  return {
    intent: "CAPTURE",
    application_context: {
      brand_name: "Concordia Restaurant",
      locale: "de-DE",
      landing_page: "LOGIN",
      shipping_preference: isPickup ? "NO_SHIPPING" : "GET_FROM_FILE",
      user_action: "PAY_NOW"
    },
    purchase_units: [
      {
        custom_id: orderId,
        description,
        amount: {
          currency_code: "EUR",
          value: formatEur(amount)
        }
      }
    ]
  };
}

type PayPalOrderResource = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    payments?: { captures?: Array<{ id?: string; status?: string }> };
  }>;
};

function getPayPalCapture(resource: PayPalOrderResource) {
  return resource.purchase_units?.[0]?.payments?.captures?.[0] ?? null;
}

async function fetchPayPalOrder(
  paypalOrderId: string,
  credentials: BranchPayPalCredentials
) {
  return paypalRequest(
    `/v2/checkout/orders/${paypalOrderId}`,
    "GET",
    null,
    credentials
  ) as Promise<PayPalOrderResource>;
}

async function markOrderPaidFromPayPalCapture(
  orderId: string,
  captureId: string,
  notifyKitchen: boolean
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { paymentStatus: true }
  });
  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "paid") {
    return { newlyPaid: false as const };
  }

  await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
    paidAt: new Date(),
    paypalCaptureId: captureId,
    transactionId: captureId
  });

  if (notifyKitchen) {
    await ordersService.notifyKitchenOrder(orderId);
  }

  void sendOrderConfirmationEmail(orderId).catch((err) => {
    logger.warn({ err, orderId }, "Order confirmation email after PayPal failed");
  });

  return { newlyPaid: true as const };
}

async function requireBranchPayPal(branchId: string) {
  const credentials = await getBranchPayPalCredentials(branchId);
  if (!isBranchPayPalConfigured(credentials)) {
    throw new Error("PayPal is not configured for this branch");
  }
  return credentials!;
}

export const paymentsService = {
  async getConfig(branchId?: string) {
    const methods = {
      cash: true,
      card: false,
      apple_pay: false,
      google_pay: false,
      paypal: false,
      klarna: false,
      sepa: false
    };

    let stripeAccountId: string | null = null;
    let stripeReady = false;

    if (branchId) {
      const branchPayment = await getBranchPaymentPublic(branchId);
      const paypalCredentials = await getBranchPayPalCredentials(branchId);
      stripeAccountId = branchPayment.stripeAccountId;
      stripeReady = branchPayment.stripeReady;
      methods.card = branchPayment.cardEnabled;
      methods.apple_pay = branchPayment.applePayEnabled;
      methods.google_pay = branchPayment.googlePayEnabled;
      methods.paypal =
        branchPayment.paypalEnabled && isBranchPayPalConfigured(paypalCredentials);
    }

    const onlinePaymentsEnabled =
      stripeReady || methods.paypal || methods.card || methods.apple_pay || methods.google_pay;

    const paypalCredentials = branchId ? await getBranchPayPalCredentials(branchId) : null;

    return {
      cardPaymentsEnabled: methods.card || methods.apple_pay || methods.google_pay,
      onlinePaymentsEnabled,
      paypalClientId:
        methods.paypal && paypalCredentials ? paypalCredentials.clientId : null,
      paypalMode: isPayPalModeLive() ? ("live" as const) : ("sandbox" as const),
      stripePublishableKey: getStripePublishableKey(),
      stripeAccountId,
      stripeReady,
      currency: "EUR",
      methods
    };
  },

  async createStripePaymentIntent(orderId: string, authenticatedCustomerId?: string | null) {
    return createOrderStripePaymentIntent(orderId, { authenticatedCustomerId });
  },

  async confirmStripePayment(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "paid") {
      return { success: true, alreadyPaid: true };
    }
    if (!order.paymentIntentId) {
      throw new Error("Missing payment session");
    }

    const payment = await getBranchPaymentPublic(order.branchId);
    if (!payment.stripeAccountId) {
      throw new Error("Branch payment account not configured");
    }

    const intent = await confirmStripePaymentIntent(
      order.paymentIntentId,
      payment.stripeAccountId
    );

    if (intent.status !== "succeeded") {
      throw new Error("Payment is not complete yet");
    }

    await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
      paidAt: new Date(),
      transactionId: intent.id
    });
    await ordersService.notifyKitchenOrder(orderId);

    void sendOrderConfirmationEmail(orderId).catch((err) => {
      logger.warn({ err, orderId }, "Order confirmation email after Stripe failed");
    });

    return { success: true, paymentIntentId: intent.id };
  },

  async createGiftCardStripePaymentIntent(purchaseId: string) {
    return createGiftCardStripePaymentIntent(purchaseId);
  },

  async confirmGiftCardStripePayment(purchaseId: string) {
    const card = await getGiftCardPurchase(purchaseId);
    if (!card) throw new Error("Gift card purchase not found");
    if (card.paymentStatus === "paid") {
      return { success: true, alreadyPaid: true, code: card.code };
    }
    if (!card.stripePaymentIntentId) {
      throw new Error("Missing payment session");
    }

    const payment = await getBranchPaymentPublic(card.branchId);
    if (!payment.stripeAccountId) {
      throw new Error("Branch payment account not configured");
    }

    const intent = await confirmStripePaymentIntent(
      card.stripePaymentIntentId,
      payment.stripeAccountId
    );

    if (intent.status !== "succeeded") {
      throw new Error("Payment is not complete yet");
    }

    const activation = await activateGiftCardAfterPayment(purchaseId, intent.id);
    return { success: true, code: activation.code, paymentIntentId: intent.id };
  },

  async createPayPalOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { item: true } } }
    });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "paid") throw new Error("Order is already paid");

    const branchPayment = await getBranchPaymentPublic(order.branchId);
    if (!branchPayment.paypalEnabled) {
      throw new Error("PayPal is not enabled for this branch");
    }

    const credentials = await requireBranchPayPal(order.branchId);

    const amount = Number(order.orderTotal ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid order amount");
    }

    if (order.paypalOrderId) {
      const existing = await fetchPayPalOrder(order.paypalOrderId, credentials);
      if (existing.status === "COMPLETED") {
        throw new Error("Order is already paid");
      }
      if (existing.status === "CREATED" || existing.status === "APPROVED") {
        return { paypalOrderId: order.paypalOrderId, orderId };
      }
    }

    const result = await paypalRequest(
      "/v2/checkout/orders",
      "POST",
      buildPayPalOrderBody(
        orderId,
        `Concordia order ${orderId.slice(0, 8)}`,
        amount,
        order.fulfillmentType
      ),
      credentials
    );

    if (!result?.id) {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Failed to create PayPal order");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paypalOrderId: result.id,
        paymentMethod: "PAYPAL"
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

    const credentials = await requireBranchPayPal(order.branchId);

    const existingPayPalOrder = await fetchPayPalOrder(order.paypalOrderId, credentials);
    if (existingPayPalOrder.status === "COMPLETED") {
      const existingCapture = getPayPalCapture(existingPayPalOrder);
      if (existingCapture?.id) {
        const { newlyPaid } = await markOrderPaidFromPayPalCapture(
          orderId,
          existingCapture.id,
          true
        );
        return {
          success: true,
          captureId: existingCapture.id,
          alreadyPaid: !newlyPaid
        };
      }
    }

    if (existingPayPalOrder.status !== "APPROVED") {
      throw new Error("PayPal payment is not approved yet");
    }

    const result = await paypalRequest(
      `/v2/checkout/orders/${order.paypalOrderId}/capture`,
      "POST",
      null,
      credentials
    );

    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture || capture.status !== "COMPLETED") {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Payment capture failed");
    }

    const { newlyPaid } = await markOrderPaidFromPayPalCapture(orderId, capture.id, true);

    return { success: true, captureId: capture.id, alreadyPaid: !newlyPaid };
  },

  async createGiftCardPayPalOrder(purchaseId: string) {
    const card = await getGiftCardPurchase(purchaseId);
    if (!card) throw new Error("Gift card purchase not found");
    if (card.paymentStatus === "paid") throw new Error("Gift card is already paid");

    const branchPayment = await getBranchPaymentPublic(card.branchId);
    if (!branchPayment.paypalEnabled) {
      throw new Error("PayPal is not enabled for this branch");
    }

    const credentials = await requireBranchPayPal(card.branchId);

    const amount = Number(card.initialAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid gift card amount");
    }

    if (card.paypalOrderId) {
      const existing = await fetchPayPalOrder(card.paypalOrderId, credentials);
      if (existing.status === "COMPLETED") {
        throw new Error("Gift card is already paid");
      }
      if (existing.status === "CREATED" || existing.status === "APPROVED") {
        return { paypalOrderId: card.paypalOrderId, purchaseId };
      }
    }

    const result = await paypalRequest(
      "/v2/checkout/orders",
      "POST",
      buildPayPalOrderBody(
        `gift:${purchaseId}`,
        `Concordia Gutschein ${purchaseId.slice(0, 8)}`,
        amount,
        "pickup"
      ),
      credentials
    );

    if (!result?.id) {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Failed to create PayPal order");
    }

    await prisma.branchGiftCard.update({
      where: { id: purchaseId },
      data: { paypalOrderId: result.id }
    });

    return { paypalOrderId: result.id, purchaseId };
  },

  async captureGiftCardPayPalOrder(purchaseId: string) {
    const card = await getGiftCardPurchase(purchaseId);
    if (!card) throw new Error("Gift card purchase not found");
    if (card.paymentStatus === "paid") {
      return { success: true, alreadyPaid: true, code: card.code };
    }
    if (!card.paypalOrderId) {
      throw new Error("Missing PayPal order ID");
    }

    const credentials = await requireBranchPayPal(card.branchId);

    const existingPayPalOrder = await fetchPayPalOrder(card.paypalOrderId, credentials);
    if (existingPayPalOrder.status === "COMPLETED") {
      const existingCapture = getPayPalCapture(existingPayPalOrder);
      if (existingCapture?.id) {
        const activation = await activateGiftCardAfterPayment(purchaseId, existingCapture.id);
        return {
          success: true,
          code: activation.code,
          captureId: existingCapture.id,
          alreadyPaid: activation.alreadyPaid
        };
      }
    }

    if (existingPayPalOrder.status !== "APPROVED") {
      throw new Error("PayPal payment is not approved yet");
    }

    const result = await paypalRequest(
      `/v2/checkout/orders/${card.paypalOrderId}/capture`,
      "POST",
      null,
      credentials
    );

    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture || capture.status !== "COMPLETED") {
      const detail = result?.details?.[0]?.description ?? result?.message;
      throw new Error(detail ?? "Payment capture failed");
    }

    const activation = await activateGiftCardAfterPayment(purchaseId, capture.id);
    return { success: true, code: activation.code, captureId: capture.id };
  }
};
