import type { Request, Response, NextFunction  } from "express";
import { cartService } from "../services/cart.service.js";
import { success, fail } from "./controllerHelper.js";

export const CartController = {
  checkout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const summary = await cartService.checkout(customerId, req.body);
      return success(res, summary);
    } catch (err: unknown) {
      next(err);
    }
  }
};






