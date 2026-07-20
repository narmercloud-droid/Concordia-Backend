import { validatePromoCode } from "./promoCode.service.ts";
import { validateGiftCard } from "./giftCard.service.ts";
import {
  validateCustomerCouponForOrder,
  validateCustomerCouponsForOrder
} from "./customerCoupon.service.ts";
import { prisma } from "../../prisma/client.ts";

export async function validateDiscountCode(
  branchId: string,
  code: string,
  orderTotal: number,
  options?: {
    customerId?: string | null;
    customerCouponId?: string | null;
    customerCouponIds?: string[] | null;
  }
) {
  const stackedIds = (options?.customerCouponIds ?? [])
    .map((id) => String(id ?? "").trim())
    .filter(Boolean);
  if (options?.customerId && stackedIds.length > 1) {
    return validateCustomerCouponsForOrder(
      options.customerId,
      stackedIds,
      branchId,
      orderTotal
    );
  }

  const singleId =
    stackedIds[0] ||
    (options?.customerCouponId ? String(options.customerCouponId).trim() : "");

  if (options?.customerId && singleId) {
    return validateCustomerCouponForOrder(
      options.customerId,
      singleId,
      branchId,
      orderTotal
    );
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
    const promo = await validatePromoCode(code, orderTotal, branchId);
    return { ...promo, kind: "promo" as const };
  } catch {
    const gift = await validateGiftCard(branchId, code, orderTotal);
    return gift;
  }
}
