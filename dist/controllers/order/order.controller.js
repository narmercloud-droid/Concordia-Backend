import { OrderService } from "../../services/order/order.service.js";
import { success, fail } from "../controllerHelper.js";
import { kitchenCreateOrderSchema, kitchenUpdateStatusSchema } from "../../validation/order.schema.js";
import { orderIdParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class OrderController {
    static async createOrder(req, res, next) {
        try {
            const parsed = kitchenCreateOrderSchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { items, paymentMethod, customerId, isGuest } = parsed.data;
            const branchId = req.user.branchId;
            const orderData = {
                branchId,
                customerId,
                isGuest,
                paymentMethod,
                items
            };
            const order = await OrderService.createOrder(orderData);
            return success(res, order, "Order created", 201);
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const parsedParams = orderIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = kitchenUpdateStatusSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const { orderId } = parsedParams.data;
            const { status, estimated_time } = parsedBody.data;
            const order = await OrderService.updateStatus(orderId, status, estimated_time);
            return success(res, order, "Order status updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async courierPickup(req, res, next) {
        try {
            const parsedParams = orderIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const { orderId } = parsedParams.data;
            const order = await OrderService.courierPickup(orderId);
            return success(res, order, "Courier pickup recorded");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getActiveOrders(req, res, next) {
        try {
            const orders = await OrderService.getActiveOrders();
            return success(res, orders, "Active orders fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getOrder(req, res, next) {
        try {
            const parsedParams = orderIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const { orderId } = parsedParams.data;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return fail(res, "NOT_FOUND", "Order not found", 404);
            }
            return success(res, order, "Order fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
