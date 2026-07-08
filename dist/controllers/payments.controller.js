import { paymentsService } from "../services/payments.service.js";
import { createBranchOnboardingLink, getBranchPaymentPublic, syncBranchStripeAccount, updateBranchPaymentFlags } from "../services/stripe/branchStripe.service.js";
import { getBranchPayPalAdminView, updateBranchPayPalSettings } from "../services/paypal/branchPayPal.service.js";
import { isStripeConfigured } from "../services/stripe/stripeClient.js";
import { sanitizeClientErrorMessage } from "../lib/sanitizeErrorMessage.js";
import { wrap, fail } from "../contracts/api.js";
export const PaymentsController = {
    getConfig: wrap(async (req) => {
        const branchId = typeof req.query.branchId === "string" ? req.query.branchId.trim() : undefined;
        return paymentsService.getConfig(branchId);
    }),
    createStripePaymentIntent: wrap(async (req) => {
        const { orderId } = req.body;
        if (!orderId || typeof orderId !== "string") {
            throw fail("INVALID_INPUT", "orderId is required");
        }
        if (!isStripeConfigured()) {
            throw fail("PAYMENT_FAILED", "Stripe is not configured");
        }
        const authenticatedCustomerId = req.customer?.id ?? null;
        try {
            return await paymentsService.createStripePaymentIntent(orderId, authenticatedCustomerId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not start card payment");
        }
    }),
    confirmStripePayment: wrap(async (req) => {
        const { orderId } = req.body;
        if (!orderId || typeof orderId !== "string") {
            throw fail("INVALID_INPUT", "orderId is required");
        }
        try {
            return await paymentsService.confirmStripePayment(orderId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not confirm payment");
        }
    }),
    createGiftCardStripePaymentIntent: wrap(async (req) => {
        const { purchaseId } = req.body;
        if (!purchaseId || typeof purchaseId !== "string") {
            throw fail("INVALID_INPUT", "purchaseId is required");
        }
        try {
            return await paymentsService.createGiftCardStripePaymentIntent(purchaseId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not start gift card payment");
        }
    }),
    confirmGiftCardStripePayment: wrap(async (req) => {
        const { purchaseId } = req.body;
        if (!purchaseId || typeof purchaseId !== "string") {
            throw fail("INVALID_INPUT", "purchaseId is required");
        }
        try {
            return await paymentsService.confirmGiftCardStripePayment(purchaseId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not confirm gift card payment");
        }
    }),
    createPayPalOrder: wrap(async (req) => {
        const { orderId } = req.body;
        if (!orderId || typeof orderId !== "string") {
            throw fail("INVALID_INPUT", "orderId is required");
        }
        try {
            return await paymentsService.createPayPalOrder(orderId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not start card payment");
        }
    }),
    capturePayPalOrder: wrap(async (req) => {
        const { orderId } = req.body;
        if (!orderId || typeof orderId !== "string") {
            throw fail("INVALID_INPUT", "orderId is required");
        }
        try {
            return await paymentsService.capturePayPalOrder(orderId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not capture payment");
        }
    }),
    createGiftCardPayPalOrder: wrap(async (req) => {
        const { purchaseId } = req.body;
        if (!purchaseId || typeof purchaseId !== "string") {
            throw fail("INVALID_INPUT", "purchaseId is required");
        }
        try {
            return await paymentsService.createGiftCardPayPalOrder(purchaseId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not start gift card payment");
        }
    }),
    captureGiftCardPayPalOrder: wrap(async (req) => {
        const { purchaseId } = req.body;
        if (!purchaseId || typeof purchaseId !== "string") {
            throw fail("INVALID_INPUT", "purchaseId is required");
        }
        try {
            return await paymentsService.captureGiftCardPayPalOrder(purchaseId);
        }
        catch (err) {
            throw fail("PAYMENT_FAILED", err?.message ?? "Could not capture gift card payment");
        }
    }),
    getBranchPaymentStatus: wrap(async (req) => {
        const branchId = req.params.branchId;
        if (!branchId)
            throw fail("INVALID_INPUT", "branchId is required");
        const settings = await syncBranchStripeAccount(branchId);
        const publicView = await getBranchPaymentPublic(branchId);
        const paypalView = await getBranchPayPalAdminView(branchId);
        return {
            branchId,
            stripeAccountId: settings.stripeAccountId,
            stripeChargesEnabled: settings.stripeChargesEnabled,
            stripeDetailsSubmitted: settings.stripeDetailsSubmitted,
            stripePayoutsEnabled: settings.stripePayoutsEnabled,
            cardEnabled: settings.cardEnabled,
            applePayEnabled: settings.applePayEnabled,
            googlePayEnabled: settings.googlePayEnabled,
            paypalEnabled: settings.paypalEnabled,
            paypalClientId: paypalView.paypalClientId,
            paypalWebhookId: paypalView.paypalWebhookId,
            paypalConfigured: paypalView.paypalConfigured,
            paypalSecretSet: paypalView.paypalSecretSet,
            stripeReady: publicView.stripeReady,
            stripeConfigured: isStripeConfigured()
        };
    }),
    createBranchOnboardingLink: wrap(async (req) => {
        const branchId = req.params.branchId;
        const returnUrl = String(req.body?.returnUrl ?? "").trim();
        const refreshUrl = String(req.body?.refreshUrl ?? returnUrl).trim();
        if (!branchId)
            throw fail("INVALID_INPUT", "branchId is required");
        if (!returnUrl)
            throw fail("INVALID_INPUT", "returnUrl is required");
        try {
            return await createBranchOnboardingLink(branchId, returnUrl, refreshUrl);
        }
        catch (err) {
            const stripeMessage = typeof err?.raw?.message === "string"
                ? err.raw.message
                : typeof err?.message === "string"
                    ? err.message
                    : undefined;
            throw fail("PAYMENT_FAILED", sanitizeClientErrorMessage(stripeMessage ?? err?.message) ??
                "Could not create Stripe onboarding link");
        }
    }),
    updateBranchPaymentSettings: wrap(async (req) => {
        const branchId = req.params.branchId;
        if (!branchId)
            throw fail("INVALID_INPUT", "branchId is required");
        const body = req.body ?? {};
        await updateBranchPaymentFlags(branchId, {
            cardEnabled: body.cardEnabled,
            applePayEnabled: body.applePayEnabled,
            googlePayEnabled: body.googlePayEnabled,
            paypalEnabled: body.paypalEnabled
        });
        await updateBranchPayPalSettings(branchId, {
            paypalClientId: body.paypalClientId,
            paypalClientSecret: body.paypalClientSecret,
            paypalWebhookId: body.paypalWebhookId,
            paypalEnabled: body.paypalEnabled
        });
        const settings = await syncBranchStripeAccount(branchId);
        const publicView = await getBranchPaymentPublic(branchId);
        const paypalView = await getBranchPayPalAdminView(branchId);
        return {
            branchId,
            stripeAccountId: settings.stripeAccountId,
            stripeChargesEnabled: settings.stripeChargesEnabled,
            stripeDetailsSubmitted: settings.stripeDetailsSubmitted,
            stripePayoutsEnabled: settings.stripePayoutsEnabled,
            cardEnabled: settings.cardEnabled,
            applePayEnabled: settings.applePayEnabled,
            googlePayEnabled: settings.googlePayEnabled,
            paypalEnabled: settings.paypalEnabled,
            paypalClientId: paypalView.paypalClientId,
            paypalWebhookId: paypalView.paypalWebhookId,
            paypalConfigured: paypalView.paypalConfigured,
            paypalSecretSet: paypalView.paypalSecretSet,
            stripeReady: publicView.stripeReady,
            stripeConfigured: isStripeConfigured()
        };
    })
};
