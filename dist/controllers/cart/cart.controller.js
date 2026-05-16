import { CartService } from "../../services/cart/cart.service.js";
import { PricingService } from "../../services/cart/pricing.service.js";
import { success, fail } from "../controllerHelper.js";
import { cartAddItemSchema, cartQuantitySchema, cartIdParamSchema, cartItemIdParamSchema, cartLoadQuerySchema } from "../../validation/cart.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class CartController {
    static async loadCart(req, res, next) {
        try {
            const parsed = cartLoadQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { cartId } = parsed.data;
            const cart = await CartService.getOrCreateCart(cartId);
            return success(res, cart, "Cart loaded");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getCart(req, res, next) {
        try {
            const parsedParams = cartIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const { cartId } = parsedParams.data;
            const cart = await CartService.getCart(cartId);
            if (!cart) {
                return fail(res, "NOT_FOUND", "Cart not found", 404);
            }
            const totals = await PricingService.calculateCart(cart);
            return success(res, { cart, totals }, "Cart fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async addItem(req, res, next) {
        try {
            const parsedParams = cartIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = cartAddItemSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const { cartId } = parsedParams.data;
            const { itemId, quantity } = parsedBody.data;
            const item = await CartService.addItem(cartId, itemId, quantity);
            return success(res, item, "Item added", 201);
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async updateQuantity(req, res, next) {
        try {
            const parsedParams = cartItemIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = cartQuantitySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const { cartItemId } = parsedParams.data;
            const { quantity } = parsedBody.data;
            const result = await CartService.updateQuantity(cartItemId, quantity);
            return success(res, result, "Quantity updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async removeItem(req, res, next) {
        try {
            const parsedParams = cartItemIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const { cartItemId } = parsedParams.data;
            await CartService.removeItem(cartItemId);
            return success(res, { success: true }, "Item removed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
