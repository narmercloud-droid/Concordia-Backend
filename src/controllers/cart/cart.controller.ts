import type { Request } from "express";
import { CartService } from "../../services/cart/cart.service.ts";
import { PricingService } from "../../services/cart/pricing.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class CartController {
  static loadCart = wrap(async (req: Request) => {
    const { cartId } = req.query;
    const cart = await CartService.getOrCreateCart(cartId as string);
    return cart;
  });

  static getCart = wrap(async (req: Request) => {
    const { cartId } = req.params;
    const cart = await CartService.getCart(cartId);
    if (!cart) throw fail('NOT_FOUND', 'Cart not found');

    const totals = await PricingService.calculateCart(cart);
    return { cart, totals };
  });

  static addItem = wrap(async (req: Request) => {
    const { cartId } = req.params;
    const { itemId, quantity } = req.body;
    const item = await CartService.addItem(cartId, itemId, quantity);
    return item;
  });

  static updateQuantity = wrap(async (req: Request) => {
    const cartItemId = req.params.cartItemId;
    const { quantity } = req.body;
    const result = await CartService.updateQuantity(cartItemId, quantity);
    return result;
  });

  static removeItem = wrap(async (req: Request) => {
    const cartItemId = req.params.cartItemId;
    await CartService.removeItem(cartItemId);
    return { success: true };
  });
}





