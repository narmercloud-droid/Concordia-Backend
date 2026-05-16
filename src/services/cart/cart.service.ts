import { prisma } from "../../prisma/client.js";
import { v4 as uuid } from "uuid";

export class CartService {
  static async getOrCreateCart(cartId?: string) {
    if (cartId) {
      const existing = await prisma.cart.findUnique({
        where: { id: cartId }
      });
      if (existing) return existing;
    }

    const newCartId = `cart_${uuid()}`;
    return prisma.cart.create({
      data: { id: newCartId }
    });
  }

  static async getCart(cartId: string) {
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

  static async addItem(cartId: string, itemId: string, quantity: number) {
    return prisma.cartItem.create({
      data: {
        cartId,
        itemId,
        quantity
      }
    });
  }

  static async updateQuantity(cartItemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  }

  static async removeItem(cartItemId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId }
    });
  }

  static async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId }
    });
  }

  static async calculateTotal(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    if (!cart) return { total: 0, items: [] };

    let total = 0;
    const items = cart.items.map(cartItem => {
      const item = cartItem.item;
      const itemTotal = item.price * cartItem.quantity;
      total += itemTotal;
      return {
        ...cartItem,
        item,
        variantId: (cartItem as any).variantId || "",
        total: itemTotal
      };
    });

    return { total, items };
  }

  static async checkout(cartId: string, customerId: string, branchId: string, paymentMethod: string) {
    const { total, items } = await this.calculateTotal(cartId);
    
    const order = await prisma.order.create({
      data: {
        branchId,
        customerId,
        isGuest: false,
        paymentMethod,
        paymentStatus: 'pending',
        status: 'pending'
      }
    });

    for (const cartItem of items) {
      await prisma.orderItem.create({
        data: {
          order: { connect: { id: order.id } },
          item: { connect: { id: cartItem.itemId } },
          variantId: cartItem.variantId,
          quantity: cartItem.quantity,
          price: cartItem.item.price
        }
      });
    }

    await this.clearCart(cartId);

    return { order, total, items };
  }
}
