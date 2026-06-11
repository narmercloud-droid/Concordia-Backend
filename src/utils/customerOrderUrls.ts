import { env } from "../config/env.ts";

export function getFrontendBaseUrl() {
  return env.FRONTEND_URL ?? "http://localhost:5173";
}

export function buildOrderTrackingUrl(orderId: string) {
  return `${getFrontendBaseUrl()}/customer/order/${orderId}`;
}

export function buildOrderReviewUrl(orderId: string) {
  return `${buildOrderTrackingUrl(orderId)}#review`;
}
