import { prisma } from "../../prisma/client.ts";
import { paypalRequest } from "../../services/paypal/paypalClient.ts";
import { getBranchPayPalCredentials } from "../../services/paypal/branchPayPal.service.ts";
import { WalletService } from "../../services/wallet.service.ts";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const refundPayPalPayment = wrap(async (req) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw fail('NOT_FOUND', 'Order not found');

    if (!order.paypalCaptureId) {
      throw fail('INVALID_INPUT', 'No PayPal capture to refund');
    }

    const credentials = await getBranchPayPalCredentials(order.branchId);
    if (!credentials) throw fail('PAYMENT_FAILED', 'PayPal is not configured for this branch');

    const result = await paypalRequest(
      `/v2/payments/captures/${order.paypalCaptureId}/refund`,
      "POST",
      {},
      credentials
    );

    await OrderLifecycleService.updatePaymentStatus(orderId, "REFUNDED");

    // Refund to wallet
    await WalletService.addFunds(
      order.customerId,
      Number(order.externalAmount as any),
      "REFUND",
      orderId
    );

    return { success: true, refund: result };
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Refund error');
  }
});

