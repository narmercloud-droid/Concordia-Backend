import { ordersService } from "../services/orders.service.js";
import { success, fail } from "./controllerHelper.js";
export const OrdersController = {
    create: async (req, res, next) => {
        try {
            const order = await ordersService.createOrder(req.body);
            return success(res, order);
        }
        catch (err) {
            next(err);
        }
    },
    listBranchOrders: async (req, res, next) => {
        try {
            const orders = await ordersService.listBranchOrders(req.params.branchId);
            return success(res, orders);
        }
        catch (err) {
            next(err);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const order = await ordersService.updateStatus(req.params.id, req.body.status);
            return success(res, order);
        }
        catch (err) {
            next(err);
        }
    },
    courierClaim: async (req, res, next) => {
        try {
            const { orderId, courierToken } = req.body;
            const order = await ordersService.validateCourierToken(orderId, courierToken);
            if (!order)
                return fail(res, "Invalid or expired token", 403);
            const updated = await ordersService.updateStatus(orderId, "picked_up");
            return success(res, updated);
        }
        catch (err) {
            next(err);
        }
    },
    courierPickedUp: async (req, res, next) => {
        try {
            const { orderId, courierToken } = req.body;
            const order = await ordersService.validateCourierToken(orderId, courierToken);
            if (!order)
                return fail(res, "Invalid or expired token", 403);
            const updated = await ordersService.courierPickedUp(orderId);
            return success(res, updated);
        }
        catch (err) {
            next(err);
        }
    },
    courierDelivered: async (req, res, next) => {
        try {
            const { orderId, courierToken } = req.body;
            const order = await ordersService.validateCourierToken(orderId, courierToken);
            if (!order)
                return fail(res, "Invalid or expired token", 403);
            const updated = await ordersService.courierDelivered(orderId);
            return success(res, updated);
        }
        catch (err) {
            next(err);
        }
    }
};
