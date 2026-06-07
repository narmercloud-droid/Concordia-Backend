export const WEBSITE_ORDER_DISCOUNT_PCT = 10

export function calcWebsiteDiscount(subtotal: number) {
  if (subtotal <= 0) return 0
  return Math.round(subtotal * WEBSITE_ORDER_DISCOUNT_PCT) / 100
}
