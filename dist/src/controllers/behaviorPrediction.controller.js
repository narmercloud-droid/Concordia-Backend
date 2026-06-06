import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import { success } from "./controllerHelper.js";
export const BehaviorPredictionController = {
    profile: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await behaviorPredictionService.fullProfile(customerId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
