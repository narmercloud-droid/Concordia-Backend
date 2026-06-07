import { prisma } from "../../prisma/client.ts";

export type PromoValidation = {
  code: string;
  type: string;
  discountAmount: number;
  promoCodeId: string;
};

function calcDiscountAmount(
  type: string,
  amount: number,
  orderTotal: number
): number {
  const normalized = type.toLowerCase();
  if (normalized === "percent" || normalized === "percentage") {
    return Math.round(orderTotal * amount) / 100;
  }
  if (normalized === "fixed" || normalized === "amount" || normalized === "euro") {
    return Math.min(orderTotal, amount);
  }
  throw new Error("Ungültiger Gutscheintyp");
}

export async function validatePromoCode(
  code: string,
  orderTotal: number
): Promise<PromoValidation> {
  const normalized = code.trim();
  if (!normalized) {
    throw new Error("Bitte Gutscheincode eingeben");
  }

  const promo = await prisma.promoCode.findFirst({
    where: {
      code: { equals: normalized, mode: "insensitive" }
    }
  });

  if (!promo) throw new Error("Gutscheincode ungültig");
  if (!promo.isActive) throw new Error("Gutscheincode ist nicht mehr gültig");
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    throw new Error("Gutscheincode abgelaufen");
  }
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
    throw new Error("Gutscheincode bereits vollständig eingelöst");
  }
  if (orderTotal < promo.minOrder) {
    throw new Error(
      `Mindestbestellwert ${promo.minOrder.toFixed(2).replace(".", ",")} € für diesen Gutschein`
    );
  }

  const discountAmount = calcDiscountAmount(promo.type, promo.amount, orderTotal);
  if (discountAmount <= 0) {
    throw new Error("Gutscheincode bringt keinen Rabatt");
  }

  return {
    code: promo.code,
    type: promo.type,
    discountAmount,
    promoCodeId: promo.id
  };
}

export async function redeemPromoCode(promoCodeId: string) {
  await prisma.promoCode.update({
    where: { id: promoCodeId },
    data: { usedCount: { increment: 1 } }
  });
}
