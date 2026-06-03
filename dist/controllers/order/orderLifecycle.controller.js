import { prisma } from "../../prisma/client.js";
import { randomUUID } from "crypto";
import { emitOrderReady, emitOrderCompleted, emitOrderRejected } from "../../events/terminalEvents.js";
import { PaymentOrchestrator } from "../../services/paymentOrchestrator.service.js";
import { WalletService } from "../../services/wallet.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { wrap, fail } from "../../contracts/api.js";
function buildOrderItems(items) {
    return items.map(i => ({
        id: randomUUID(),
        quantity: i.qty ?? i.quantity ?? 1,
        notes: i.notes ?? null,
        price: i.price,
        variantId: i.variantId,
        addOnIds: i.addOnIds ?? [],
        item: {
            connect: { id: i.itemId }
        }
    }));
}
// Helper to get the Socket.IO instance
async function getIO() {
    const { getIO } = await import("../../lib/socket.js");
    return getIO();
}
export const OrderLifecycleController = {
    // Create order with payment orchestration
    createOrder: wrap(async (req) => {
        const customerId = req.body.customerId;
        const branchId = req.body.branchId;
        const { items, addressId, paymentMethod } = req.body;
        if (!branchId) {
            throw fail('INVALID_INPUT', 'branchId is required to create an order');
        }
        // 1. Calculate order total
        const orderTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        // 2. Resolve payment split
        const payment = await PaymentOrchestrator.resolvePayment(customerId, orderTotal, paymentMethod);
        // 3. Create order with payment metadata
        const order = await prisma.order.create({
            data: {
                id: randomUUID(),
                branchId,
                customerId,
                items: {
                    create: buildOrderItems(items)
                },
                paymentMethod: payment.method,
                paymentStatus: payment.requiresExternalPayment
                    ? "AWAITING_EXTERNAL_PAYMENT"
                    : payment.method === "COD"
                        ? "PENDING_PAYMENT"
                        : "PAID",
                walletUsed: payment.walletUsed,
                externalAmount: payment.externalAmount
            }
        });
        // 4. If no external payment is required, deduct wallet immediately
        if (!payment.requiresExternalPayment) {
            await WalletService.deductFunds(customerId, Number(payment.walletUsed), order.id);
            await OrderLifecycleService.updatePaymentStatus(order.id, "PAID", { paidAt: new Date() });
        }
        // 5. Return order + payment instructions
        return {
            orderId: order.id,
            paymentMethod: payment.method,
            walletUsed: payment.walletUsed,
            externalAmount: payment.externalAmount,
            requiresExternalPayment: payment.requiresExternalPayment
        };
    }),
    // Confirm external payment and finalize wallet deduction
    confirmExternalPayment: wrap(async (req) => {
        const { orderId, transactionId } = req.body;
        const customerId = req.body.customerId;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw fail('NOT_FOUND', 'Order not found');
        // Deduct wallet portion
        await WalletService.deductFunds(customerId, Number(order.walletUsed), orderId);
        // Mark order as paid
        await OrderLifecycleService.updatePaymentStatus(orderId, "PAID", {
            transactionId,
            paidAt: new Date()
        });
        return { success: true };
    }),
    // Mark order as preparing
    preparing: wrap(async (req) => {
        const { id } = req.params;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw fail('NOT_FOUND', 'Order not found');
        }
        const updatedOrder = await OrderLifecycleService.updateStatus(id, "preparing");
        const io = await getIO();
        emitOrderReady(io, updatedOrder);
        return updatedOrder;
    }),
    // Mark order as ready
    ready: wrap(async (req) => {
        const { id } = req.params;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw fail('NOT_FOUND', 'Order not found');
        }
        const updatedOrder = await OrderLifecycleService.updateStatus(id, "ready_for_pickup");
        const io = await getIO();
        emitOrderReady(io, updatedOrder);
        return updatedOrder;
    }),
    // Mark order as completed
    completed: wrap(async (req) => {
        const { id } = req.params;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw fail('NOT_FOUND', 'Order not found');
        }
        const updatedOrder = await OrderLifecycleService.updateStatus(id, "completed");
        const io = await getIO();
        emitOrderCompleted(io, updatedOrder);
        return updatedOrder;
    }),
    // Reject order
    reject: wrap(async (req) => {
        const { id } = req.params;
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw fail('NOT_FOUND', 'Order not found');
        }
        const updatedOrder = await OrderLifecycleService.updateStatus(id, "rejected");
        const io = await getIO();
        emitOrderRejected(io, updatedOrder, order.terminal_id);
        return updatedOrder;
    }),
};
export const refundOrder = wrap(async (req) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw fail('NOT_FOUND', 'Order not found');
        if (order.paymentStatus !== "PAID") {
            throw fail('INVALID_OPERATION', 'Only paid orders can be refunded');
        }
        // Refund wallet portion
        if (Number(order.walletUsed) > 0) {
            await WalletService.addFunds(order.customerId, Number(order.walletUsed), "REFUND", orderId);
        }
        // Refund external portion (PayPal/card)
        if (Number(order.externalAmount) > 0) {
            await WalletService.addFunds(order.customerId, Number(order.externalAmount), "REFUND", orderId);
        }
        await OrderLifecycleService.updatePaymentStatus(orderId, "REFUNDED");
        return { success: true };
    }
    catch (err) {
        throw fail('BAD_REQUEST', err.message || 'Invalid request');
    }
});
export const cancelOrder = wrap(async (req) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw fail('NOT_FOUND', 'Order not found');
        if (order.paymentStatus === "PAID") {
            throw fail('INVALID_OPERATION', 'Paid orders must be refunded, not cancelled');
        }
        await OrderLifecycleService.updatePaymentStatus(orderId, "CANCELLED");
        return { success: true };
    }
    catch (err) {
        throw fail('BAD_REQUEST', err.message || 'Invalid request');
    }
});
export const confirmExternalPayment = OrderLifecycleController.confirmExternalPayment;
