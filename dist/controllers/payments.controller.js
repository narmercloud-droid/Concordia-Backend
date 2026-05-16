import { paymentsService } from "../services/payments.service.js";
export const PaymentsController = {
    // STRIPE
    createStripeIntent: async (req, res, next) => {
        try {
            const { orderId, amount } = req.body;
            const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
            res.json({ clientSecret: intent.client_secret });
        }
        catch (err) {
            next(err);
        }
    },
    // PAYPAL
    createPayPalOrder: async (req, res, next) => {
        try {
            const { orderId, amount } = req.body;
            const order = await paymentsService.createPayPalOrder(orderId, amount);
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    },
    capturePayPalOrder: async (req, res, next) => {
        try {
            const { orderId } = req.body;
            const result = await paymentsService.capturePayPalOrder(orderId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    // REFUND
    refund: async (req, res, next) => {
        try {
            const order = await paymentsService.refund(req.params.id);
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    }
};
