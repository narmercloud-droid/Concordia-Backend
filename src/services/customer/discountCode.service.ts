import { validatePromoCode } from "./promoCode.service.ts";
import { validateGiftCard } from "./giftCard.service.ts";

export type DiscountValidation =
  | ({
      kind: "promo";
      promoCodeId: string;
      type: string;
    } & {
      code: string;
      discountAmount: number;
    })
  | ({
      kind: "gift";
      giftCardId: string;
      balanceRemaining: number;
    } & {
      code: string;
      discountAmount: number;
    });

export async function validateDiscountCode(
  branchId: string,
  code: string,
  orderTotal: number
): Promise<DiscountValidation> {
  try {
    const promo = await validatePromoCode(code, orderTotal);
    return { ...promo, kind: "promo" };
  } catch {
    const gift = await validateGiftCard(branchId, code, orderTotal);
    return gift;
  }
}
