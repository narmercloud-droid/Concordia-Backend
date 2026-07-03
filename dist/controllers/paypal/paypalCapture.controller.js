import { prisma } from "../../prisma/client.js";
import { paypalRequest } from "../../services/paypal/paypalClient.js";
import { getBranchPayPalCredentials } from "../../services/paypal/branchPayPal.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const capturePayPalPayment = wrap(async (req) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw fail('NOT_FOUND', 'Order not found');
        if (!order.paypalOrderId) {
            throw fail('INVALID_INPUT', 'Missing PayPal order ID');
        }
        const credentials = await getBranchPayPalCredentials(order.branchId);
        if (!credentials)
            throw fail('PAYMENT_FAILED', 'PayPal is not configured for this branch');
        const result = await paypalRequest(`/v2/checkout/orders/${order.paypalOrderId}/capture`, "POST", null, credentials);
        const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
        if (!capture) {
            throw fail('PAYMENT_FAILED', 'Capture failed');
        }
        await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
            paidAt: new Date(),
            paypalCaptureId: capture.id,
            transactionId: capture.id
        });
        return { success: true, capture };
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Capture error');
    }
});
