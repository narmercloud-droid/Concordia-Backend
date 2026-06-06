import { paymentsService } from "../services/payments.service.js";
import { wrap } from "../contracts/api.js";
export const PaymentsController = {
    // STRIPE
    createStripeIntent: wrap(async (req) => {
        const { orderId, amount } = req.body;
        const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
        return { clientSecret: intent.client_secret };
    }),
    // PAYPAL
    createPayPalOrder: wrap(async (req) => {
        const { orderId, amount } = req.body;
        const order = await paymentsService.createPayPalOrder(orderId, amount);
        return order;
    }),
    capturePayPalOrder: wrap(async (req) => {
        const { orderId } = req.body;
        const result = await paymentsService.capturePayPalOrder(orderId);
        return result;
    }),
    // REFUND
    refund: wrap(async (req) => {
        const order = await paymentsService.refund(req.params.id);
        return order;
    })
};
