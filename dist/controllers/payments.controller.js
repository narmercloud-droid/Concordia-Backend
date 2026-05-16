import { paymentsService } from "../services/payments.service.js";
import { success, fail } from "./controllerHelper.js";
import { createStripeIntentBodySchema, createPayPalOrderBodySchema, capturePayPalBodySchema } from "../validation/payments.schema.js";
import { idParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const PaymentsController = {
    createStripeIntent: async (req, res, next) => {
        try {
            const parsed = createStripeIntentBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { orderId, amount } = parsed.data;
            const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
            return success(res, { clientSecret: intent.client_secret }, "Stripe payment intent created successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    createPayPalOrder: async (req, res, next) => {
        try {
            const parsed = createPayPalOrderBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { orderId, amount } = parsed.data;
            const order = await paymentsService.createPayPalOrder(orderId, amount);
            return success(res, order, "PayPal order created successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    capturePayPalOrder: async (req, res, next) => {
        try {
            const parsed = capturePayPalBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { orderId } = parsed.data;
            const result = await paymentsService.capturePayPalOrder(orderId);
            return success(res, result, "PayPal order captured successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    refund: async (req, res, next) => {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const order = await paymentsService.refund(parsed.data.id);
            return success(res, order, "Refund processed successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
