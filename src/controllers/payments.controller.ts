import type { Request } from "express";
import { paymentsService } from "../services/payments.service.ts";
import { wrap, fail } from "../contracts/api.js";

export const PaymentsController = {
  getConfig: wrap(async () => paymentsService.getConfig()),

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
  })
};
