import { prisma } from "../../prisma/client.js";
import { success, fail } from "../controllerHelper.js";
import { idParamSchema } from "../../validation/common.schema.js";
import { AdminSocket } from "../../socket/admin.socket.js";
async function getIO() {
    const { getIO } = await import("../../lib/socket.js");
    return getIO();
}
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const OrderLifecycleController = {
    async preparing(req, res, next) {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { id } = parsed.data;
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "preparing" }
            });
            const { OrderService } = await import("../../services/order/order.service.js");
            OrderService.emitOrderStatus(updatedOrder);
            return success(res, updatedOrder, "Order preparing");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    async ready(req, res, next) {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { id } = parsed.data;
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "ready_for_pickup" }
            });
            const { OrderService } = await import("../../services/order/order.service.js");
            OrderService.emitOrderStatus(updatedOrder);
            return success(res, updatedOrder, "Order ready");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    async completed(req, res, next) {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { id } = parsed.data;
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "completed" }
            });
            // Update analytics
            const { CustomerAnalyticsService } = await import("../../services/ai/customerAnalytics.service.js");
            const { MenuAnalyticsService } = await import("../../services/ai/menuAnalytics.service.js");
            const { CourierAnalyticsService } = await import("../../services/ai/courierAnalytics.service.js");
            const { DemandForecastService } = await import("../../services/ai/demandForecast.service.js");
            await CustomerAnalyticsService.updateCustomerStats(updatedOrder);
            await MenuAnalyticsService.updateMenuItemStats(updatedOrder);
            await DemandForecastService.recordBranchDemand(updatedOrder);
            await CourierAnalyticsService.updateCourierPerformance(updatedOrder);
            // Trigger AI update events
            await AdminSocket.triggerChurnUpdate(updatedOrder);
            await AdminSocket.triggerDemandUpdate(updatedOrder);
            await AdminSocket.triggerCourierPerformanceUpdate(updatedOrder);
            await AdminSocket.triggerAIUpdateAfterOrder(updatedOrder);
            const { OrderService } = await import("../../services/order/order.service.js");
            OrderService.emitOrderStatus(updatedOrder);
            return success(res, updatedOrder, "Order completed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    async reject(req, res, next) {
        try {
            const parsed = idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { id } = parsed.data;
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: "rejected" }
            });
            const { OrderService } = await import("../../services/order/order.service.js");
            OrderService.emitOrderStatus(updatedOrder);
            return success(res, updatedOrder, "Order rejected");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
