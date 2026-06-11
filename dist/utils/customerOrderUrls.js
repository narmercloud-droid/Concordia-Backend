import { env } from "../config/env.js";
export function getFrontendBaseUrl() {
    return env.FRONTEND_URL ?? "http://localhost:5173";
}
export function buildOrderTrackingUrl(orderId) {
    return `${getFrontendBaseUrl()}/customer/order/${orderId}`;
}
export function buildOrderReviewUrl(orderId) {
    return `${buildOrderTrackingUrl(orderId)}#review`;
}
