import { fraudService } from "../services/fraud.service.js";
export const FraudController = {
    scoreOrder: async (req, res, next) => {
        try {
            const { orderId } = req.body;
            const result = await fraudService.scoreOrder(orderId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    getRisk: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await fraudService.getRisk(orderId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    flags: async (req, res, next) => {
        try {
            const flags = await fraudService.getFlags();
            res.json(flags);
        }
        catch (err) {
            next(err);
        }
    },
    events: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const events = await fraudService.getOrderEvents(orderId);
            res.json(events);
        }
        catch (err) {
            next(err);
        }
    }
};
