import { prisma } from "../../prisma/client.js";
import { paypalRequest } from "../../services/paypal/paypalClient.js";
import { WalletService } from "../../services/wallet.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { success, fail } from "../controllerHelper.js";
export const refundPayPalPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return fail(res, "Order not found", 404);
        if (!order.paypalCaptureId) {
            return fail(res, "No PayPal capture to refund", 400);
        }
        const result = await paypalRequest(`/v2/payments/captures/${order.paypalCaptureId}/refund`, "POST", {});
        await OrderLifecycleService.updatePaymentStatus(orderId, "REFUNDED");
        // Refund to wallet
        await WalletService.addFunds(order.customerId, Number(order.externalAmount), "REFUND", orderId);
        return success(res, { success: true, refund: result });
    }
    catch (err) {
        console.error(err);
        return fail(res, "Refund error", 500);
    }
};
