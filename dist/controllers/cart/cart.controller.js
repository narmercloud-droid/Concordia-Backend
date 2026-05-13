import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";
export class CartController {
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
    static async getCart(req, res, next) {
        try {
            const { cartId } = req.params;
            const cart = await CartService.getCart(cartId);
            if (!cart) {
                return res.status(404).json({ error: "Cart not found" });
            }
            const totals = await PricingService.calculateCart(cart);
            res.json({ cart, totals });
        }
        catch (err) {
            next(err);
        }
    }
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
    static async updateQuantity(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            const { quantity } = req.body;
            const result = await CartService.updateQuantity(cartItemId, quantity);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    }
    static async removeItem(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            await CartService.removeItem(cartItemId);
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
