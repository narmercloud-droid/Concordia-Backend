"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../../services/cart/cart.service");
const pricing_service_1 = require("../../services/cart/pricing.service");
class CartController {
    // Create or load a cart
    static async loadCart(req, res) {
        const { cartId } = req.query;
        const cart = await cart_service_1.CartService.getOrCreateCart(cartId);
        res.json(cart);
    }
    // Get full cart + totals
    static async getCart(req, res) {
        const { cartId } = req.params;
        const cart = await cart_service_1.CartService.getCart(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const totals = await pricing_service_1.PricingService.calculateCart(cart);
        res.json({
            cart,
            totals
        });
    }
    // Add item to cart
    static async addItem(req, res) {
        const { cartId } = req.params;
        const { itemId, quantity } = req.body;
        const item = await cart_service_1.CartService.addItem(cartId, itemId, quantity);
        res.status(201).json(item);
    }
    // Add variant to cart item
    static async addVariant(req, res) {
        const cartItemId = Number(req.params.cartItemId);
        const { variantId } = req.body;
        const result = await cart_service_1.CartService.addVariant(cartItemId, variantId);
        res.status(201).json(result);
    }
    // Add topping to cart item
    static async addTopping(req, res) {
        const cartItemId = Number(req.params.cartItemId);
        const { toppingId } = req.body;
        const result = await cart_service_1.CartService.addTopping(cartItemId, toppingId);
        res.status(201).json(result);
    }
    // Add extra to cart item
    static async addExtra(req, res) {
        const cartItemId = Number(req.params.cartItemId);
        const { extraId } = req.body;
        const result = await cart_service_1.CartService.addExtra(cartItemId, extraId);
        res.status(201).json(result);
    }
    // Update quantity
    static async updateQuantity(req, res) {
        const cartItemId = Number(req.params.cartItemId);
        const { quantity } = req.body;
        const result = await cart_service_1.CartService.updateQuantity(cartItemId, quantity);
        res.json(result);
    }
    // Remove item from cart
    static async removeItem(req, res) {
        const cartItemId = Number(req.params.cartItemId);
        await cart_service_1.CartService.removeItem(cartItemId);
        res.json({ success: true });
    }
}
exports.CartController = CartController;
