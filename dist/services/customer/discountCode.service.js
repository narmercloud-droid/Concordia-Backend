import { validatePromoCode } from "./promoCode.service.js";
import { validateGiftCard } from "./giftCard.service.js";
import { validateCustomerCouponForOrder } from "./customerCoupon.service.js";
import { prisma } from "../../prisma/client.js";
export async function validateDiscountCode(branchId, code, orderTotal, options) {
    if (options?.customerId && options?.customerCouponId) {
        const coupon = await validateCustomerCouponForOrder(options.customerId, options.customerCouponId, branchId, orderTotal);
        return coupon;
    }
    if (code.startsWith("CC-") && options?.customerId) {
        const row = await prisma.customerCoupon.findFirst({
            where: {
                claimCode: { equals: code, mode: "insensitive" },
                customerId: options.customerId
            }
        });
        if (row) {
            return validateCustomerCouponForOrder(options.customerId, row.id, branchId, orderTotal);
        }
    }
    try {
        const promo = await validatePromoCode(code, orderTotal);
        return { ...promo, kind: "promo" };
    }
    catch {
        const gift = await validateGiftCard(branchId, code, orderTotal);
        return gift;
    }
}
