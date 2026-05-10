import { Request, Response } from "express";
import { CartService } from "../../services/cart/cart.service";
import { PricingService } from "../../services/cart/pricing.service";

export class CartController {
  // Create or load a cart
  static async loadCart(req: Request, res: Response) {
    const { cartId } = req.query;
    const cart = await CartService.getOrCreateCart(cartId as string);
    res.json(cart);
  }

  // Get full cart + totals
  static async getCart(req: Request, res: Response) {
    const { cartId } = req.params;

    const cart = await CartService.getCart(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const totals = await PricingService.calculateCart(cart);

    res.json({
      cart,
      totals
    });
  }

  // Add item to cart
  static async addItem(req: Request, res: Response) {
    const { cartId } = req.params;
    const { itemId, quantity } = req.body;

    const item = await CartService.addItem(cartId, itemId, quantity);
    res.status(201).json(item);
  }

  // Add variant to cart item
  static async addVariant(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartItemId);
    const { variantId } = req.body;

    const result = await CartService.addVariant(cartItemId, variantId);
    res.status(201).json(result);
  }

  // Add topping to cart item
  static async addTopping(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartItemId);
    const { toppingId } = req.body;

    const result = await CartService.addTopping(cartItemId, toppingId);
    res.status(201).json(result);
  }

  // Add extra to cart item
  static async addExtra(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartItemId);
    const { extraId } = req.body;

    const result = await CartService.addExtra(cartItemId, extraId);
    res.status(201).json(result);
  }

  // Update quantity
  static async updateQuantity(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    const result = await CartService.updateQuantity(cartItemId, quantity);
    res.json(result);
  }

  // Remove item from cart
  static async removeItem(req: Request, res: Response) {
    const cartItemId = Number(req.params.cartItemId);

    await CartService.removeItem(cartItemId);
    res.json({ success: true });
  }
}
