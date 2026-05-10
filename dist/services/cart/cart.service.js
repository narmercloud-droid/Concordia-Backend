"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const client_1 = require("../../prisma/client");
const uuid_1 = require("uuid");
class CartService {
    // Create or load existing cart
    static async getOrCreateCart(cartId) {
        if (cartId) {
            const existing = await client_1.prisma.cart.findUnique({
                where: { cart_id: cartId }
            });
            if (existing)
                return existing;
        }
        const newCartId = `cart_${(0, uuid_1.v4)()}`;
        return client_1.prisma.cart.create({
            data: { cart_id: newCartId }
        });
    }
    // Get full cart with items + options
    static async getCart(cartId) {
        return client_1.prisma.cart.findUnique({
            where: { cart_id: cartId },
            include: {
                items: {
                    include: {
                        item: true,
                        variant: { include: { variant: true } },
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
    }
    // Add item to cart
    static async addItem(cartId, itemId, quantity) {
        return client_1.prisma.cartItem.create({
            data: {
                cart_id: cartId,
                item_id: itemId,
                quantity
            }
        });
    }
    // Add variant to cart item
    static async addVariant(cartItemId, variantId) {
        return client_1.prisma.cartItemVariant.create({
            data: {
                cart_item_id: cartItemId,
                variant_id: variantId
            }
        });
    }
    // Add topping
    static async addTopping(cartItemId, toppingId) {
        return client_1.prisma.cartItemTopping.create({
            data: {
                cart_item_id: cartItemId,
                topping_id: toppingId
            }
        });
    }
    // Add extra
    static async addExtra(cartItemId, extraId) {
        return client_1.prisma.cartItemExtra.create({
            data: {
                cart_item_id: cartItemId,
                extra_id: extraId
            }
        });
    }
    // Update quantity
    static async updateQuantity(cartItemId, quantity) {
        return client_1.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });
    }
    // Remove item
    static async removeItem(cartItemId) {
        return client_1.prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    }
}
exports.CartService = CartService;
