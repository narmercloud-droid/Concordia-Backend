import { z } from "zod";

export const paymentsBodySchema = z.record(z.string(), z.unknown());

export const createStripeIntentBodySchema = z.object({
  orderId: z.string().min(1),
  amount: z.number()
});

export const createPayPalOrderBodySchema = z.object({
  orderId: z.string().min(1),
  amount: z.number()
});

export const capturePayPalBodySchema = z.object({
  orderId: z.string().min(1)
});
