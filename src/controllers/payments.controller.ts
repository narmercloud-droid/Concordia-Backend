import { Request, Response, NextFunction } from "express";
import { paymentsService } from "../services/payments.service.js";
import { prisma } from "../prisma/client.js";

export const PaymentsController = {
  // STRIPE
  createStripeIntent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;
      const intent = await paymentsService.createStripePaymentIntent(orderId, amount);
      res.json({ clientSecret: intent.client_secret });
    } catch (err: unknown) {
      next(err);
    }
  },

  // PAYPAL
  createPayPalOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, amount } = req.body;
      const order = await paymentsService.createPayPalOrder(orderId, amount);
      res.json(order);
    } catch (err: unknown) {
      next(err);
    }
  },

  capturePayPalOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body;
      const result = await paymentsService.capturePayPalOrder(orderId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  // REFUND
  refund: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await paymentsService.refund(req.params.id);
      res.json(order);
    } catch (err: unknown) {
      next(err);
    }
  }
};


