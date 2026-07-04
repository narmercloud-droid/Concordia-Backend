/** Shared payment helpers for orders (checkout, terminal, kitchen). */

export function normalizePaymentMethod(method?: string | null) {
  const value = (method ?? "cash").toLowerCase();
  if (value === "cash" || value === "cod") return "COD";
  if (value === "card" || value === "apple_pay" || value === "google_pay") return "CARD";
  if (value === "paypal") return "PAYPAL";
  if (value === "klarna") return "KLARNA";
  if (value === "sepa") return "SEPA";
  return "COD";
}

export function requiresOnlinePayment(method?: string | null) {
  const normalized = normalizePaymentMethod(method);
  return ["CARD", "PAYPAL", "KLARNA", "SEPA"].includes(normalized);
}

export function isPaymentSettled(paymentStatus?: string | null) {
  const status = (paymentStatus ?? "").toLowerCase();
  return status === "paid";
}

/** Kitchen / terminal must not act on online orders until payment is captured. */
export function isKitchenReadyOrder(order: {
  paymentMethod?: string | null;
  paymentStatus?: string | null;
}) {
  if (requiresOnlinePayment(order.paymentMethod)) {
    return isPaymentSettled(order.paymentStatus);
  }
  return true;
}

export function isUnpaidOnlineOrder(order: {
  paymentMethod?: string | null;
  paymentStatus?: string | null;
}) {
  return requiresOnlinePayment(order.paymentMethod) && !isPaymentSettled(order.paymentStatus);
}
