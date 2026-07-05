/** Shared payment helpers for orders (checkout, terminal, kitchen). */
export function normalizePaymentMethod(method) {
    const value = (method ?? "cash").toLowerCase();
    if (value === "cash" || value === "cod")
        return "COD";
    if (value === "card" || value === "apple_pay" || value === "google_pay")
        return "CARD";
    if (value === "paypal")
        return "PAYPAL";
    if (value === "klarna")
        return "KLARNA";
    if (value === "sepa")
        return "SEPA";
    return "COD";
}
export function requiresOnlinePayment(method) {
    const normalized = normalizePaymentMethod(method);
    return ["CARD", "PAYPAL", "KLARNA", "SEPA"].includes(normalized);
}
export function isPaymentSettled(paymentStatus) {
    const status = (paymentStatus ?? "").toLowerCase();
    return status === "paid";
}
export function isAwaitingOnlinePayment(paymentStatus) {
    const status = (paymentStatus ?? "").toLowerCase();
    return status === "pending" || status === "awaiting_payment";
}
/** Kitchen / terminal must not act on online orders until payment is captured. */
export function isKitchenReadyOrder(order) {
    if (requiresOnlinePayment(order.paymentMethod)) {
        return isPaymentSettled(order.paymentStatus);
    }
    return true;
}
export function isUnpaidOnlineOrder(order) {
    return requiresOnlinePayment(order.paymentMethod) && !isPaymentSettled(order.paymentStatus);
}
const CHECKOUT_TRACKING_TAGS = {
    "checkout:customer_abandoned": "customer_abandoned",
    "checkout:payment_failed": "payment_failed",
    "checkout:changed_payment": "customer_abandoned"
};
export function cancelReasonToTrackingStatus(reason) {
    const value = (reason ?? "customer_abandoned").trim().toLowerCase();
    if (value === "payment_failed")
        return "checkout:payment_failed";
    if (value === "changed_payment")
        return "checkout:changed_payment";
    return "checkout:customer_abandoned";
}
export function getOrderCheckoutTagLabel(tag) {
    switch (tag) {
        case "customer_abandoned":
            return "Checkout cancelled";
        case "payment_failed":
            return "Payment failed";
        case "unpaid_incomplete":
            return "Unpaid / incomplete";
        default:
            return tag;
    }
}
/** Tag for abandoned checkout, failed payment, or never-completed online orders. */
export function resolveOrderCheckoutTag(order) {
    if (isPaymentSettled(order.paymentStatus) || order.paidAt) {
        return null;
    }
    if (!requiresOnlinePayment(order.paymentMethod)) {
        return null;
    }
    for (const event of order.trackingEvents ?? []) {
        const fromEvent = CHECKOUT_TRACKING_TAGS[event.status];
        if (fromEvent)
            return fromEvent;
    }
    const status = (order.status ?? "").toLowerCase();
    const paymentStatus = (order.paymentStatus ?? "").toLowerCase();
    if (paymentStatus === "failed") {
        return "payment_failed";
    }
    if (status === "cancelled" || paymentStatus === "cancelled") {
        return "customer_abandoned";
    }
    if (status === "pending" && isAwaitingOnlinePayment(paymentStatus) && isUnpaidOnlineOrder(order)) {
        return "unpaid_incomplete";
    }
    return null;
}
const ONLINE_PAYMENT_METHODS = [
    "CARD",
    "PAYPAL",
    "KLARNA",
    "SEPA",
    "APPLE_PAY",
    "GOOGLE_PAY",
    "STRIPE"
];
function awaitingPaymentStatusOr() {
    return [
        { paymentStatus: { equals: "pending", mode: "insensitive" } },
        { paymentStatus: { equals: "awaiting_payment", mode: "insensitive" } }
    ];
}
export function checkoutIssuePrismaFilter(issue) {
    const key = (issue ?? "").trim().toLowerCase();
    if (!key || key === "all")
        return null;
    const onlineMethodOr = ONLINE_PAYMENT_METHODS.flatMap((method) => [
        { paymentMethod: { equals: method, mode: "insensitive" } },
        { paymentMethod: { equals: method.toLowerCase(), mode: "insensitive" } }
    ]);
    const checkoutEventOr = (status) => ({
        trackingEvents: { some: { status } }
    });
    if (key === "checkout_issues") {
        return {
            OR: [
                checkoutEventOr("checkout:customer_abandoned"),
                checkoutEventOr("checkout:payment_failed"),
                checkoutEventOr("checkout:changed_payment"),
                {
                    AND: [
                        { status: "cancelled" },
                        {
                            OR: [
                                { paymentStatus: { equals: "cancelled", mode: "insensitive" } },
                                { paymentStatus: { equals: "pending", mode: "insensitive" } }
                            ]
                        },
                        { OR: onlineMethodOr }
                    ]
                },
                {
                    AND: [
                        { status: "pending" },
                        {
                            OR: [
                                ...awaitingPaymentStatusOr(),
                                { paymentStatus: { equals: "failed", mode: "insensitive" } }
                            ]
                        },
                        { OR: onlineMethodOr }
                    ]
                }
            ]
        };
    }
    if (key === "customer_abandoned") {
        return {
            OR: [
                checkoutEventOr("checkout:customer_abandoned"),
                checkoutEventOr("checkout:changed_payment"),
                {
                    AND: [
                        { status: "cancelled" },
                        {
                            OR: [
                                { paymentStatus: { equals: "cancelled", mode: "insensitive" } },
                                { paymentStatus: { equals: "pending", mode: "insensitive" } }
                            ]
                        },
                        { OR: onlineMethodOr }
                    ]
                }
            ]
        };
    }
    if (key === "payment_failed") {
        return {
            OR: [
                checkoutEventOr("checkout:payment_failed"),
                {
                    AND: [
                        { paymentStatus: { equals: "failed", mode: "insensitive" } },
                        { OR: onlineMethodOr }
                    ]
                }
            ]
        };
    }
    if (key === "unpaid_incomplete") {
        return {
            AND: [
                { status: "pending" },
                { OR: awaitingPaymentStatusOr() },
                { OR: onlineMethodOr },
                {
                    NOT: {
                        trackingEvents: {
                            some: {
                                status: {
                                    in: [
                                        "checkout:customer_abandoned",
                                        "checkout:payment_failed",
                                        "checkout:changed_payment"
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        };
    }
    return null;
}
