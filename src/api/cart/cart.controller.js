import { PrismaClient } from '@prisma/client';
import { calculateCartItemPrice, calculateOrderTotals } from '../../services/cart/cartPricing.service.js';

const prisma = new PrismaClient();

export async function addCartItem(req, res) {
  const { orderId, menuItemId, variantId, addOnIds, quantity } = req.body;

  const totalPrice = await calculateCartItemPrice(menuItemId, variantId, addOnIds, quantity);

  const cartItem = await prisma.cartItem.create({
    data: {
      orderId,
      menuItemId,
      variantId,
      addOnIds,
      quantity,
      basePrice: totalPrice / quantity,
      totalPrice
    }
  });

  res.json(cartItem);
}

export async function getCart(req, res) {
  const { orderId } = req.params;

  const items = await prisma.cartItem.findMany({
    where: { orderId },
    include: { menuItem: true }
  });

  const totals = await calculateOrderTotals(orderId);

  res.json({ items, totals });
}

export async function removeCartItem(req, res) {
  const { cartItemId } = req.params;

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  res.json({ success: true });
}
