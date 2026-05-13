import { ordersService } from "../services/orders.service.js";
export const OrdersController = {
    create: async (req, res, next) => {
        try {
            const order = await ordersService.createOrder(req.body);
            res.json(order);
        }
        catch (err) {
            next(err);
        }
    },
    listBranchOrders: async (req, res, next) => {
        try {
            const orders = await ordersService.listBranchOrders(req.params.branchId);
            res.json(orders);
        }
        catch (err) {
            next(err);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const order = await ordersService.updateStatus(req.params.id, req.body.status);
            res.json(order);
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
                return res.status(403).json({ error: "Invalid or expired token" });
            const updated = await ordersService.updateStatus(orderId, "picked_up");
            res.json(updated);
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
                return res.status(403).json({ error: "Invalid or expired token" });
            const updated = await ordersService.courierPickedUp(orderId);
            res.json(updated);
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
                return res.status(403).json({ error: "Invalid or expired token" });
            const updated = await ordersService.courierDelivered(orderId);
            res.json(updated);
        }
        catch (err) {
            next(err);
        }
    }
};
