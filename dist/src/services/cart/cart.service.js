import { prisma } from "../../prisma/client.js";
import { v4 as uuid } from "uuid";
export class CartService {
    // Create or load existing cart
    static async getOrCreateCart(cartId) {
        if (cartId) {
            const existing = await prisma.cart.findUnique({
                where: { cart_id: cartId }
            });
            if (existing)
                return existing;
        }
        const newCartId = `cart_${uuid()}`;
        return prisma.cart.create({
            data: { cart_id: newCartId }
        });
    }
    // Get full cart with items + options
    static async getCart(cartId) {
        return prisma.cart.findUnique({
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
        return prisma.cartItem.create({
            data: {
                cart_id: cartId,
                item_id: itemId,
                quantity
            }
        });
    }
    // Add variant to cart item
    static async addVariant(cartItemId, variantId) {
        return prisma.cartItemVariant.create({
            data: {
                cart_item_id: cartItemId,
                variant_id: variantId
            }
        });
    }
    // Add topping
    static async addTopping(cartItemId, toppingId) {
        return prisma.cartItemTopping.create({
            data: {
                cart_item_id: cartItemId,
                topping_id: toppingId
            }
        });
    }
    // Add extra
    static async addExtra(cartItemId, extraId) {
        return prisma.cartItemExtra.create({
            data: {
                cart_item_id: cartItemId,
                extra_id: extraId
            }
        });
    }
    // Update quantity
    static async updateQuantity(cartItemId, quantity) {
        return prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });
    }
    // Remove item
    static async removeItem(cartItemId) {
        return prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    }
}
