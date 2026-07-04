/** Resolve the customer-facing payment method from stored order fields. */
export function resolveOrderPaymentMethod(order) {
    if (order.paypalOrderId || order.paypalCaptureId) {
        return "PAYPAL";
    }
    const method = (order.paymentMethod ?? "").trim().toUpperCase();
    if (method === "STRIPE" || order.paymentIntentId) {
        return "CARD";
    }
    if (method === "COD" || method === "CASH")
        return "COD";
    if (method === "CARD")
        return "CARD";
    if (method === "PAYPAL")
        return "PAYPAL";
    if (method === "KLARNA")
        return "KLARNA";
    if (method === "SEPA")
        return "SEPA";
    return method || "COD";
}
