import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";
import { success, fail } from "../controllerHelper.js";
export class CartController {
    static async loadCart(req, res, next) {
        try {
            const { cartId } = req.query;
            const cart = await CartService.getOrCreateCart(cartId);
            return success(res, cart);
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
                return fail(res, "Cart not found", 404);
            }
            const totals = await PricingService.calculateCart(cart);
            return success(res, { cart, totals });
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
            return success(res, item);
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
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    }
    static async removeItem(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            await CartService.removeItem(cartItemId);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    }
}
