import { KdsService } from "../../services/kds/kds.service.js";
export const KdsController = {
    getOrders: async (req, res, next) => {
        try {
            const kds = req.user;
            const orders = await KdsService.getActiveOrders(kds.branchId);
            res.json({ orders });
        }
        catch (err) {
            next(err);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const { orderId, status } = req.body;
            const kds = req.user;
            const valid = ["preparing", "ready", "completed"];
            if (!valid.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }
            const order = await KdsService.updateStatus(orderId, status);
            req.app
                .get("io")
                .to(`branch_${kds.branchId}`)
                .emit("order_status_updated", order);
            req.app
                .get("io")
                .to(`customer_${order.id}`)
                .emit("order_update", order);
            res.json({ success: true, order });
        }
        catch (err) {
            next(err);
        }
    }
};
