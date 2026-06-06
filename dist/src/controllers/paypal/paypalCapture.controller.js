import { prisma } from "../../prisma/client.js";
import { paypalRequest } from "../../services/paypal/paypalClient.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { success, fail } from "../controllerHelper.js";
export const capturePayPalPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return fail(res, "Order not found", 404);
        if (!order.paypalOrderId) {
            return fail(res, "Missing PayPal order ID", 400);
        }
        const result = await paypalRequest(`/v2/checkout/orders/${order.paypalOrderId}/capture`, "POST");
        const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
        if (!capture) {
            return fail(res, "Capture failed", 400);
        }
        await OrderLifecycleService.updatePaymentStatus(orderId, "paid", {
            paidAt: new Date(),
            paypalCaptureId: capture.id,
            transactionId: capture.id
        });
        return success(res, { success: true, capture });
    }
    catch (err) {
        console.error(err);
        return fail(res, "Capture error", 500);
    }
};
