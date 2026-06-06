import { prisma } from "../../prisma/client.js";
import { randomUUID } from "crypto";
import { v4 as uuid } from "uuid";
export class CartService {
    static async getOrCreateCart(cartId) {
        if (cartId) {
            const existing = await prisma.cart.findUnique({
                where: { id: cartId }
            });
            if (existing)
                return existing;
        }
        const newCartId = `cart_${uuid()}`;
        return prisma.cart.create({
            data: { id: newCartId }
        });
    }
    static async getCart(cartId) {
        return prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        item: true
                    }
                }
            }
        });
    }
    static async addItem(cartId, itemId, quantity) {
        return prisma.cartItem.create({
            data: {
                id: randomUUID(),
                cartId,
                itemId,
                quantity
            }
        });
    }
    static async updateQuantity(cartItemId, quantity) {
        return prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });
    }
    static async removeItem(cartItemId) {
        return prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    }
}
