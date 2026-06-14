import { env } from "../config/env.ts";

const PRODUCTION_FRONTEND = "https://www.concordiapizza.de";

export function getFrontendBaseUrl() {
  if (env.FRONTEND_URL) return env.FRONTEND_URL.replace(/\/$/, "");
  if (env.NODE_ENV === "production") return PRODUCTION_FRONTEND;
  return "http://localhost:5173";
}

export function buildCourierUrl(token: string) {
  return `${getFrontendBaseUrl()}/courier/order?token=${token}`;
}

export function buildOrderTrackingUrl(orderId: string) {
  return `${getFrontendBaseUrl()}/customer/order/${orderId}`;
}

export function buildOrderReviewUrl(orderId: string) {
  return `${buildOrderTrackingUrl(orderId)}#review`;
}
