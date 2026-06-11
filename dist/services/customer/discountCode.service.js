import { validatePromoCode } from "./promoCode.service.js";
import { validateGiftCard } from "./giftCard.service.js";
export async function validateDiscountCode(branchId, code, orderTotal) {
    try {
        const promo = await validatePromoCode(code, orderTotal);
        return { ...promo, kind: "promo" };
    }
    catch {
        const gift = await validateGiftCard(branchId, code, orderTotal);
        return gift;
    }
}
