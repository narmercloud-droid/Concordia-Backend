import { prisma } from "../prisma/client.js";

export class OfferService {
  async validateOffer(code: string, order: any): Promise<any> {
    const offer = await prisma.offer.findUnique({ where: { code } });
    if (!offer) return null;

    const total = Number(order?.total ?? 0);
    if (offer.expiresAt && offer.expiresAt < new Date()) {
      return { valid: false, reason: "Offer has expired." };
    }

    if (offer.minOrder != null && total < offer.minOrder) {
      return {
        valid: false,
        reason: `This offer requires a minimum spend of ${offer.minOrder}.`
      };
    }

    const discountPct = offer.discountPct ?? 0;
    const discountAmt = offer.discountAmt ?? 0;
    const discountValue = Math.max(0, (total * discountPct) / 100 + discountAmt);

    return {
      valid: true,
      code: offer.code,
      description: offer.description,
      discountPct,
      discountAmt,
      freeDelivery: offer.freeDelivery,
      minOrder: offer.minOrder,
      expiresAt: offer.expiresAt,
      total,
      discount: discountValue,
      finalTotal: Math.max(0, total - discountValue)
    };
  }
}

export const offerService = new OfferService();

