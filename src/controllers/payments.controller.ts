import type { AuthenticatedRequest } from "../globalTypes.js";
import type { Response, NextFunction  } from "express";
import { paymentsService } from "../services/payments.service.js";
import { prisma } from "../prisma/client.js";
import { success } from "./controllerHelper.js";

export const PaymentsController = {
  // STRIPE
  createStripeIntent: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;
      const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
      return success(res, { clientSecret: intent.client_secret });
    } catch (err: unknown) {
      next(err);
    }
  },

  // PAYPAL
  createPayPalOrder: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;
      const order = await paymentsService.createPayPalOrder(orderId, amount);
      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  },

  capturePayPalOrder: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result = await paymentsService.capturePayPalOrder(orderId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  // REFUND
  refund: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const order = await paymentsService.refund(req.params.id);
      return success(res, order);
    } catch (err: unknown) {
      next(err);
    }
  }
};







