import { prisma } from "../../prisma/client.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
const STATUS_TRANSITIONS = {
    pending: ["accepted", "rejected", "cancelled", "assigned", "acknowledged"],
    accepted: ["preparing", "rejected", "out_for_delivery", "cancelled"],
    preparing: ["ready_for_pickup", "out_for_delivery", "rejected", "cancelled"],
    ready_for_pickup: ["picked_up", "cancelled"],
    out_for_delivery: ["picked_up", "delivered", "cancelled"],
    picked_up: ["delivered", "cancelled"],
    assigned: ["accepted", "rejected", "acknowledged"],
    acknowledged: ["accepted", "rejected"],
    courier_assigned: ["out_for_delivery", "picked_up", "delivered", "rejected"],
    completed: [],
    delivered: [],
    rejected: [],
    cancelled: []
};
function normalizeStatus(status) {
    return status === "ready" ? "ready_for_pickup" : status;
}
function isPickup(fulfillmentType) {
    const t = (fulfillmentType ?? "").toLowerCase();
    return t.includes("pickup") || t.includes("abhol");
}
function isPickupOrder(order) {
    if (order.deliveryAddress?.trim())
        return false;
    return isPickup(order.fulfillmentType);
}
function findStatusPath(current, target, fulfillmentType) {
    const from = normalizeStatus(current);
    const to = normalizeStatus(target);
    if (from === to)
        return [];
    const queue = [{ status: from, path: [] }];
    const visited = new Set([from]);
    while (queue.length > 0) {
        const node = queue.shift();
        const nextStatuses = STATUS_TRANSITIONS[node.status] ?? [];
        for (const next of nextStatuses) {
            if (next === to)
                return [...node.path, next];
            if (!visited.has(next)) {
                visited.add(next);
                queue.push({ status: next, path: [...node.path, next] });
            }
        }
    }
    // Terminal shortcuts for busy staff (delivery orders).
    if (!isPickup(fulfillmentType)) {
        if (from === "accepted" && to === "delivered") {
            return ["out_for_delivery", "delivered"];
        }
        if (from === "preparing" && to === "delivered") {
            return ["out_for_delivery", "delivered"];
        }
        if (from === "ready_for_pickup" && to === "delivered") {
            return ["out_for_delivery", "delivered"];
        }
        if (from === "accepted" && to === "out_for_delivery") {
            return ["out_for_delivery"];
        }
        if (from === "preparing" && to === "out_for_delivery") {
            return ["out_for_delivery"];
        }
        if (from === "ready_for_pickup" && to === "out_for_delivery") {
            return ["out_for_delivery"];
        }
        if (from === "preparing" && to === "ready_for_pickup") {
            return ["out_for_delivery"];
        }
        if (from === "accepted" && to === "ready_for_pickup") {
            return ["preparing", "out_for_delivery"];
        }
    }
    if (isPickup(fulfillmentType)) {
        if (from === "accepted" && to === "picked_up") {
            return ["preparing", "ready_for_pickup", "picked_up"];
        }
        if (from === "preparing" && to === "picked_up") {
            return ["ready_for_pickup", "picked_up"];
        }
    }
    throw new Error(`Invalid status transition from ${from} to ${to}`);
}
export async function advanceTerminalOrderStatus(orderId, targetStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new Error("Order not found");
    let target = normalizeStatus(targetStatus);
    if (!isPickupOrder(order) && target === "ready_for_pickup") {
        target = "out_for_delivery";
    }
    const fulfillment = isPickupOrder(order) ? "pickup" : "delivery";
    const steps = findStatusPath(order.status, target, fulfillment);
    let latest = order;
    for (const step of steps) {
        latest = await OrderLifecycleService.updateStatus(orderId, step);
    }
    return latest;
}
