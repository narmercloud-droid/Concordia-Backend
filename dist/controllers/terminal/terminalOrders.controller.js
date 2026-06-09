import { prisma } from "../../prisma/client.js";
import { broadcastToTerminal } from "../../services/realtime/realtime.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { resolveBranchByCode } from "../../services/terminal/branchCode.service.js";
import { ordersService } from "../../services/orders.service.js";
import { env } from "../../config/env.js";
import { wrap, fail } from "../../contracts/api.js";
function buildCourierUrl(token) {
    if (!token)
        return null;
    const base = env.FRONTEND_URL ?? "http://localhost:5173";
    return `${base}/courier/order?token=${token}`;
}
function enrichOrder(order) {
    return {
        ...order,
        courierUrl: buildCourierUrl(order.courierToken),
        items: order.items?.map((line) => ({
            ...line,
            kitchen: line.item?.kitchen ?? "B",
            name: line.item?.name ?? line.name
        }))
    };
}
export const activateTerminalByCode = wrap(async (req) => {
    const branchCode = req.body?.branch_code ?? req.body?.branchCode ?? req.body?.code;
    if (!branchCode)
        throw fail("INVALID_INPUT", "branch_code is required");
    const resolved = await resolveBranchByCode(String(branchCode));
    if (!resolved)
        throw fail("NOT_FOUND", "Invalid branch code");
    if (resolved.activationCode) {
        await prisma.activationCode.update({
            where: { id: resolved.activationCode.id },
            data: { used: true, usedAt: new Date(), deviceId: req.body?.deviceId ?? null }
        });
    }
    return {
        branchId: resolved.branch.id,
        branchName: resolved.branch.name,
        terminalCode: String(branchCode).trim().toUpperCase()
    };
});
export const getTerminalOrders = wrap(async (req) => {
    try {
        const { branchId } = req.query;
        if (!branchId)
            throw fail("INVALID_INPUT", "branchId is required");
        const orders = await prisma.order.findMany({
            where: { branchId: String(branchId) },
            include: {
                items: { include: { item: true } },
                trackingEvents: true,
                courierLocations: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return orders.map(enrichOrder);
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
    }
});
export const confirmTerminalOrder = wrap(async (req) => {
    const { id } = req.params;
    const prepMinutes = Number(req.body?.prepMinutes ?? req.body?.prep_minutes);
    try {
        const order = await ordersService.confirmOrderWithPrepTime(id, prepMinutes);
        return enrichOrder(order);
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not confirm order");
    }
});
export const getTerminalOrderDetails = wrap(async (req) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                trackingEvents: true,
                courierLocations: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                },
                items: {
                    include: { item: true }
                },
                customer: {
                    include: { addresses: true }
                }
            }
        });
        if (!order)
            throw fail('NOT_FOUND', 'Order not found');
        const response = enrichOrder(order);
        broadcastToTerminal(order.branchId, "order_update", response);
        return response;
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
    }
});
export const acceptOrder = wrap(async (req) => {
    const { orderId } = req.params;
    const updated = await OrderLifecycleService.updateStatus(orderId, "accepted");
    req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);
    return updated;
});
export const rejectOrder = wrap(async (req) => {
    const { orderId } = req.params;
    const updated = await OrderLifecycleService.updateStatus(orderId, "rejected");
    req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);
    return updated;
});
