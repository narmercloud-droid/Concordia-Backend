import { prisma } from "../../prisma/client.js";

export class PricingService {
  static async calculateCartItem(cartItem: any) {
    const item = await prisma.menuItem.findUnique({
      where: { id: cartItem.itemId }
    });

    if (!item) {
      throw new Error("Item not found");
    }

    return item.price * cartItem.quantity;
  }

  static async calculateCart(cart: any) {
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const itemTotal = await PricingService.calculateCartItem(cartItem);
      subtotal += itemTotal;
    }

    return {
      subtotal,
      total: subtotal
    };
  }
}
