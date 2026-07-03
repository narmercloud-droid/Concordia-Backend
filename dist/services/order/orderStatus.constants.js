/** Order statuses that still appear as active on terminal / admin dashboard. */
export const IN_PROGRESS_ORDER_STATUSES = [
    "pending",
    "accepted",
    "preparing",
    "ready_for_pickup",
    "ready",
    "out_for_delivery",
    "assigned",
    "acknowledged",
    "courier_assigned"
];
export const TERMINAL_DONE_ORDER_STATUSES = [
    "picked_up",
    "delivered",
    "completed",
    "rejected",
    "cancelled"
];
export const UNPAID_ONLINE_PAYMENT_STATUSES = [
    "awaiting_payment",
    "AWAITING_EXTERNAL_PAYMENT"
];
