import { env } from "../config/env.js";
const PRODUCTION_FRONTEND = "https://www.concordiapizza.de";
/** Fixed production URLs for print/social QR codes (never staging or localhost). */
export const PRODUCTION_BRANCH_ORDER_URLS = {
    "concordia-kempen": `${PRODUCTION_FRONTEND}/branch/concordia-kempen`,
    "concordia-straelen": `${PRODUCTION_FRONTEND}/branch/concordia-straelen`
};
export function getFrontendBaseUrl() {
    if (env.FRONTEND_URL)
        return env.FRONTEND_URL.replace(/\/$/, "");
    if (env.NODE_ENV === "production")
        return PRODUCTION_FRONTEND;
    return "http://localhost:5173";
}
export function buildCourierUrl(token) {
    return `${getFrontendBaseUrl()}/courier/order?token=${token}`;
}
export function buildOrderTrackingUrl(orderId) {
    return `${getFrontendBaseUrl()}/customer/order/${orderId}`;
}
export function buildOrderReviewUrl(orderId) {
    return `${buildOrderTrackingUrl(orderId)}#review`;
}
/** Customer ordering page for a branch (flyer QR codes, SMS links, etc.). */
export function buildBranchOrderUrl(branchId, opts) {
    if (opts?.productionQr && PRODUCTION_BRANCH_ORDER_URLS[branchId]) {
        return PRODUCTION_BRANCH_ORDER_URLS[branchId];
    }
    return `${getFrontendBaseUrl()}/branch/${branchId}`;
}
