import { PrismaClient } from '@prisma/client';
import { calculateOrderTotals } from '../cart/cartPricing.service.js';

const prisma = new PrismaClient();

export async function validatePromo(orderId, code) {
  const promo = await prisma.promoCode.findUnique({ where: { code } });

  if (!promo || !promo.isActive) return { valid: false, reason: 'Invalid promo code' };

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return { valid: false, reason: 'Promo code expired' };
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return { valid: false, reason: 'Promo code usage limit reached' };
  }

  const totals = await calculateOrderTotals(orderId);

  if (totals.subtotal < promo.minOrder) {
    return { valid: false, reason: `Minimum order ${promo.minOrder} required` };
  }

  let discount = 0;

  if (promo.type === 'percent') {
    discount = totals.subtotal * (promo.amount / 100);
  } else if (promo.type === 'fixed') {
    discount = promo.amount;
  }

  return { valid: true, promo, discount };
}

export async function applyPromo(orderId, promo, discount) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      promoCodeId: promo.id,
      discount
    }
  });

  await prisma.promoCode.update({
    where: { id: promo.id },
    data: { usedCount: { increment: 1 } }
  });

  return { success: true, discount };
}
