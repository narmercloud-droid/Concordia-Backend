import type { Request } from "express";
import { paymentsService } from "../services/payments.service.ts";
import {
  createBranchOnboardingLink,
  getBranchPaymentPublic,
  syncBranchStripeAccount,
  updateBranchPaymentFlags
} from "../services/stripe/branchStripe.service.ts";
import { isStripeConfigured } from "../services/stripe/stripeClient.ts";
import { wrap, fail } from "../contracts/api.js";

export const PaymentsController = {
  getConfig: wrap(async (req: Request) => {
    const branchId =
      typeof req.query.branchId === "string" ? req.query.branchId.trim() : undefined;
    return paymentsService.getConfig(branchId);
  }),

  createStripePaymentIntent: wrap(async (req: Request) => {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      throw fail("INVALID_INPUT", "orderId is required");
    }
    if (!isStripeConfigured()) {
      throw fail("PAYMENT_FAILED", "Stripe is not configured");
    }
    const authenticatedCustomerId =
      (req as Request & { customer?: { id: string } }).customer?.id ?? null;
    try {
      return await paymentsService.createStripePaymentIntent(orderId, authenticatedCustomerId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not start card payment");
    }
  }),

  confirmStripePayment: wrap(async (req: Request) => {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      throw fail("INVALID_INPUT", "orderId is required");
    }
    try {
      return await paymentsService.confirmStripePayment(orderId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not confirm payment");
    }
  }),

  createGiftCardStripePaymentIntent: wrap(async (req: Request) => {
    const { purchaseId } = req.body;
    if (!purchaseId || typeof purchaseId !== "string") {
      throw fail("INVALID_INPUT", "purchaseId is required");
    }
    try {
      return await paymentsService.createGiftCardStripePaymentIntent(purchaseId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not start gift card payment");
    }
  }),

  confirmGiftCardStripePayment: wrap(async (req: Request) => {
    const { purchaseId } = req.body;
    if (!purchaseId || typeof purchaseId !== "string") {
      throw fail("INVALID_INPUT", "purchaseId is required");
    }
    try {
      return await paymentsService.confirmGiftCardStripePayment(purchaseId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not confirm gift card payment");
    }
  }),

  createPayPalOrder: wrap(async (req: Request) => {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      throw fail("INVALID_INPUT", "orderId is required");
    }
    try {
      return await paymentsService.createPayPalOrder(orderId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not start card payment");
    }
  }),

  capturePayPalOrder: wrap(async (req: Request) => {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      throw fail("INVALID_INPUT", "orderId is required");
    }
    try {
      return await paymentsService.capturePayPalOrder(orderId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not capture payment");
    }
  }),

  createGiftCardPayPalOrder: wrap(async (req: Request) => {
    const { purchaseId } = req.body;
    if (!purchaseId || typeof purchaseId !== "string") {
      throw fail("INVALID_INPUT", "purchaseId is required");
    }
    try {
      return await paymentsService.createGiftCardPayPalOrder(purchaseId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not start gift card payment");
    }
  }),

  captureGiftCardPayPalOrder: wrap(async (req: Request) => {
    const { purchaseId } = req.body;
    if (!purchaseId || typeof purchaseId !== "string") {
      throw fail("INVALID_INPUT", "purchaseId is required");
    }
    try {
      return await paymentsService.captureGiftCardPayPalOrder(purchaseId);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not capture gift card payment");
    }
  }),

  getBranchPaymentStatus: wrap(async (req: Request) => {
    const branchId = req.params.branchId;
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const settings = await syncBranchStripeAccount(branchId);
    const publicView = await getBranchPaymentPublic(branchId);
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
      stripeReady: publicView.stripeReady,
      stripeConfigured: isStripeConfigured()
    };
  }),

  createBranchOnboardingLink: wrap(async (req: Request) => {
    const branchId = req.params.branchId;
    const returnUrl = String(req.body?.returnUrl ?? "").trim();
    const refreshUrl = String(req.body?.refreshUrl ?? returnUrl).trim();
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    if (!returnUrl) throw fail("INVALID_INPUT", "returnUrl is required");
    try {
      return await createBranchOnboardingLink(branchId, returnUrl, refreshUrl);
    } catch (err: any) {
      throw fail("PAYMENT_FAILED", err?.message ?? "Could not create Stripe onboarding link");
    }
  }),

  updateBranchPaymentSettings: wrap(async (req: Request) => {
    const branchId = req.params.branchId;
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const body = req.body ?? {};
    await updateBranchPaymentFlags(branchId, {
      cardEnabled: body.cardEnabled,
      applePayEnabled: body.applePayEnabled,
      googlePayEnabled: body.googlePayEnabled,
      paypalEnabled: body.paypalEnabled
    });
    const settings = await syncBranchStripeAccount(branchId);
    const publicView = await getBranchPaymentPublic(branchId);
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
      stripeReady: publicView.stripeReady,
      stripeConfigured: isStripeConfigured()
    };
  })
};
