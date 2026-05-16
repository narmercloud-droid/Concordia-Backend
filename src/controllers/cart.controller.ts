import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { cartService } from "../services/cart.service.js";
import { success, fail } from "./controllerHelper.js";
import { cartCheckoutBodySchema } from "../validation/cart.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const CartController = {
  checkout: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = cartCheckoutBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const customerId = req.user!.id;
      const summary = await cartService.checkout(customerId, parsed.data);
      return success(res, summary, "Checkout completed successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
