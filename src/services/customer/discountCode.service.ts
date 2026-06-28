import { validatePromoCode } from "./promoCode.service.ts";
import { validateGiftCard } from "./giftCard.service.ts";
import { validateCustomerCouponForOrder } from "./customerCoupon.service.ts";
import { prisma } from "../../prisma/client.ts";

export async function validateDiscountCode(
  branchId: string,
  code: string,
  orderTotal: number,
  options?: { customerId?: string | null; customerCouponId?: string | null }
) {
  if (options?.customerId && options?.customerCouponId) {
    const coupon = await validateCustomerCouponForOrder(
      options.customerId,
      options.customerCouponId,
      branchId,
      orderTotal
    );
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
      return validateCustomerCouponForOrder(
        options.customerId,
        row.id,
        branchId,
        orderTotal
      );
    }
  }

  try {
    const promo = await validatePromoCode(code, orderTotal);
    return { ...promo, kind: "promo" as const };
  } catch {
    const gift = await validateGiftCard(branchId, code, orderTotal);
    return gift;
  }
}
