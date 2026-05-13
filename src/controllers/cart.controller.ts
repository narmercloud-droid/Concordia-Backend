import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cart.service.js";

export const CartController = {
  checkout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const summary = await cartService.checkout(customerId, req.body);
      res.json(summary);
    } catch (err: unknown) {
      next(err);
    }
  }
};

