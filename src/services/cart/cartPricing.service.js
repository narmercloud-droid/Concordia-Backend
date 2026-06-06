import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function calculateCartItemPrice(menuItemId, variantId, addOnIds, quantity) {
  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });

  let price = item?.basePrice || 0;

  if (variantId) {
    const variant = await prisma.variant.findUnique({ where: { id: variantId } });
    if (variant) price += variant.price;
  }

  if (addOnIds?.length) {
    const addOns = await prisma.addOn.findMany({
      where: { id: { in: addOnIds } }
    });

    for (const add of addOns) {
      price += add.price;
    }
  }

  return price * quantity;
}

export async function calculateOrderTotals(orderId) {
  const cartItems = await prisma.cartItem.findMany({ where: { orderId } });

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const tax = subtotal * 0.10; // 10% tax
  const deliveryFee = 2.50;

  const total = subtotal + tax + deliveryFee;

  return { subtotal, tax, deliveryFee, total };
}
