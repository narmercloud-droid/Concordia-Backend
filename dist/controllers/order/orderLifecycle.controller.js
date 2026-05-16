import { prisma } from "../../prisma/client.js";
import { emitOrderReady, emitOrderCompleted, emitOrderRejected } from "../../events/terminalEvents.js";
// Helper to get the Socket.IO instance
async function getIO() {
    const { getIO } = await import("../../lib/socket.js");
    return getIO();
}
export const OrderLifecycleController = {
    // Mark order as preparing
    async preparing(req, res, next) {
        const { id } = req.params;
        try {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "preparing" },
            });
            const io = await getIO();
            emitOrderReady(io, updatedOrder);
            res.json(updatedOrder);
        }
        catch (err) {
            next(err);
        }
    },
    // Mark order as ready
    async ready(req, res, next) {
        const { id } = req.params;
        try {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "ready_for_pickup" },
            });
            const io = await getIO();
            emitOrderReady(io, updatedOrder);
            res.json(updatedOrder);
        }
        catch (err) {
            next(err);
        }
    },
    // Mark order as completed
    async completed(req, res, next) {
        const { id } = req.params;
        try {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "completed" }
            });
            const io = await getIO();
            emitOrderCompleted(io, updatedOrder);
            res.json(updatedOrder);
        }
        catch (err) {
            next(err);
        }
    },
    // Reject order
    async reject(req, res, next) {
        const { id } = req.params;
        try {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "rejected" }
            });
            const io = await getIO();
            emitOrderRejected(io, updatedOrder, order.terminal_id);
            res.json(updatedOrder);
        }
        catch (err) {
            next(err);
        }
    },
};
