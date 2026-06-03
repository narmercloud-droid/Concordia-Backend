import { prisma } from "../../prisma/client.js";
import { broadcastToTerminal } from "../../services/realtime/realtime.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { wrap, fail } from "../../contracts/api.js";
export const getTerminalOrders = wrap(async (req) => {
    try {
        const { branchId } = req.query;
        const orders = await prisma.order.findMany({
            where: { branchId },
            include: {
                trackingEvents: true,
                courierLocations: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return orders;
    }
    catch (err) {
        console.error(err);
        throw fail('INTERNAL_ERROR', 'Server error');
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
        const response = order;
        broadcastToTerminal(order.branchId, "order_update", order);
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
