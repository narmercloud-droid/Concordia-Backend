import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";
export class CartController {
    // Create or load a cart
    static async loadCart(req, res, next) {
        try {
            const { cartId } = req.query;
            const cart = await CartService.getOrCreateCart(cartId);
            res.json(cart);
        }
        catch (err) {
            next(err);
        }
    }
    // Get full cart + totals
    static async getCart(req, res, next) {
        try {
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
        catch (err) {
            next(err);
        }
    }
    // Add item to cart
    static async addItem(req, res, next) {
        try {
            const { cartId } = req.params;
            const { itemId, quantity } = req.body;
            const item = await CartService.addItem(cartId, itemId, quantity);
            res.status(201).json(item);
        }
        catch (err) {
            next(err);
        }
    }
    // Add variant to cart item
    static async addVariant(req, res, next) {
        try {
            const cartItemId = Number(req.params.cartItemId);
            const { variantId } = req.body;
            const result = await CartService.addVariant(cartItemId, variantId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    // Add topping to cart item
    static async addTopping(req, res, next) {
        try {
            const cartItemId = Number(req.params.cartItemId);
            const { toppingId } = req.body;
            const result = await CartService.addTopping(cartItemId, toppingId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    // Add extra to cart item
    static async addExtra(req, res, next) {
        try {
            const cartItemId = Number(req.params.cartItemId);
            const { extraId } = req.body;
            const result = await CartService.addExtra(cartItemId, extraId);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    }
    // Update quantity
    static async updateQuantity(req, res, next) {
        try {
            const cartItemId = Number(req.params.cartItemId);
            const { quantity } = req.body;
            const result = await CartService.updateQuantity(cartItemId, quantity);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    // Remove item from cart
    static async removeItem(req, res, next) {
        try {
            const cartItemId = Number(req.params.cartItemId);
            await CartService.removeItem(cartItemId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
