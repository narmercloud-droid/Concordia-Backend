import { getPlatformConfig } from "../services/platform/platformSettings.service.js";
/** @deprecated Use getWebsiteOrderDiscountPct() — kept for backwards compatibility */
export const WEBSITE_ORDER_DISCOUNT_PCT = 10;
/** @deprecated Use isFreeDrinkCheckoutGloballyEnabled() */
export const FREE_DRINK_CHECKOUT_ENABLED = false;
export function getWebsiteOrderDiscountPct() {
    return getPlatformConfig().websiteOrderDiscountPct;
}
export function isFreeDrinkCheckoutGloballyEnabled() {
    return getPlatformConfig().freeDrinkCheckoutEnabled;
}
export function calcWebsiteDiscount(subtotal, branchPromotions) {
    if (subtotal <= 0)
        return 0;
    if (branchPromotions?.websiteDiscountEnabled === false)
        return 0;
    const pct = getWebsiteOrderDiscountPct();
    if (pct <= 0)
        return 0;
    return Math.round(subtotal * pct) / 100;
}
export function isFreeDrinkPromoActive(promotions, subtotal) {
    if (!isFreeDrinkCheckoutGloballyEnabled())
        return false;
    if (promotions?.freeDrinkEnabled === false)
        return false;
    const min = Number(promotions?.freeDrinkMinOrder ?? 0);
    if (!Number.isFinite(min) || min <= 0)
        return false;
    if (subtotal != null && subtotal < min)
        return false;
    return true;
}
