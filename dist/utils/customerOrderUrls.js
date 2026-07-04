import { env } from "../config/env.js";
const PRODUCTION_FRONTEND = "https://www.concordiapizza.de";
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
export function buildBranchOrderUrl(branchId) {
    return `${getFrontendBaseUrl()}/branch/${branchId}`;
}
