import { Request, Response, NextFunction } from "express";
import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";

export class CartController {
  static async loadCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.query;
      const cart = await CartService.getOrCreateCart(cartId as string);
      res.json(cart);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.params;
      const cart = await CartService.getCart(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const totals = await PricingService.calculateCart(cart);
      res.json({ cart, totals });
    } catch (err: unknown) {
      next(err);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cartId } = req.params;
      const { itemId, quantity } = req.body;
      const item = await CartService.addItem(cartId, itemId, quantity);
      res.status(201).json(item);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;
      const result = await CartService.updateQuantity(cartItemId, quantity);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cartItemId = req.params.cartItemId;
      await CartService.removeItem(cartItemId);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  }
}
