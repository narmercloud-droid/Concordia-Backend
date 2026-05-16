import { courierService } from "../services/couriers.service.js";
export const CouriersController = {
    claim: async (req, res, next) => {
        try {
            const { orderId, courierToken } = req.body;
            const order = await courierService.validateCourierToken(orderId, courierToken);
            if (!order)
                return res.status(403).json({ error: "Invalid or expired token" });
            const updated = await courierService.claimOrder(orderId);
            res.json(updated);
        }
        catch (err) {
            next(err);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const { orderId, courierToken, status } = req.body;
            const order = await courierService.validateCourierToken(orderId, courierToken);
            if (!order)
                return res.status(403).json({ error: "Invalid or expired token" });
            const updated = await courierService.updateStatus(orderId, status);
            res.json(updated);
        }
        catch (err) {
            next(err);
        }
    }
};
