import { paymentsService } from "../services/payments.service.js";
import { success } from "./controllerHelper.js";
export const PaymentsController = {
    // STRIPE
    createStripeIntent: async (req, res, next) => {
        try {
            const { orderId, amount } = req.body;
            const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
            return success(res, { clientSecret: intent.client_secret });
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
            return success(res, order);
        }
        catch (err) {
            next(err);
        }
    },
    capturePayPalOrder: async (req, res, next) => {
        try {
            const { orderId } = req.body;
            const result = await paymentsService.capturePayPalOrder(orderId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    // REFUND
    refund: async (req, res, next) => {
        try {
            const order = await paymentsService.refund(req.params.id);
            return success(res, order);
        }
        catch (err) {
            next(err);
        }
    }
};
