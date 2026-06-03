import { fraudService } from "../services/fraud.service.js";
import { success } from "./controllerHelper.js";
export const FraudController = {
    scoreOrder: async (req, res, next) => {
        try {
            const { orderId } = req.body;
            const result = await fraudService.scoreOrder(orderId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    getRisk: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await fraudService.getRisk(orderId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    flags: async (req, res, next) => {
        try {
            const flags = await fraudService.getFlags();
            return success(res, flags);
        }
        catch (err) {
            next(err);
        }
    },
    events: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const events = await fraudService.getOrderEvents(orderId);
            return success(res, events);
        }
        catch (err) {
            next(err);
        }
    }
};
