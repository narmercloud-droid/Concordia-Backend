import { env } from "../config/env.ts";

const PRODUCTION_FRONTEND = "https://www.concordiapizza.de";

/** Fixed production URLs for print/social QR codes (never staging or localhost). */
export const PRODUCTION_BRANCH_ORDER_URLS: Record<string, string> = {
  "concordia-kempen": `${PRODUCTION_FRONTEND}/branch/concordia-kempen`,
  "concordia-straelen": `${PRODUCTION_FRONTEND}/branch/concordia-straelen`
};

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

/** Customer ordering page for a branch (flyer QR codes, SMS links, etc.). */
export function buildBranchOrderUrl(branchId: string, opts?: { productionQr?: boolean }) {
  if (opts?.productionQr && PRODUCTION_BRANCH_ORDER_URLS[branchId]) {
    return PRODUCTION_BRANCH_ORDER_URLS[branchId];
  }
  return `${getFrontendBaseUrl()}/branch/${branchId}`;
}
