export const WEBSITE_ORDER_DISCOUNT_PCT = 10

/** When false, checkout never requires or applies the free-drink promotion. */
export const FREE_DRINK_CHECKOUT_ENABLED = false

export function calcWebsiteDiscount(subtotal: number) {
  if (subtotal <= 0) return 0
  return Math.round(subtotal * WEBSITE_ORDER_DISCOUNT_PCT) / 100
}

export function isFreeDrinkPromoActive(
  promotions: Record<string, unknown> | null | undefined,
  subtotal?: number
) {
  if (!FREE_DRINK_CHECKOUT_ENABLED) return false
  if (promotions?.freeDrinkEnabled === false) return false
  const min = Number(promotions?.freeDrinkMinOrder ?? 0)
  if (!Number.isFinite(min) || min <= 0) return false
  if (subtotal != null && subtotal < min) return false
  return true
}
