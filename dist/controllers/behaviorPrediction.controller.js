import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import { wrap } from "./../contracts/api.js";
export const BehaviorPredictionController = {
    profile: wrap(async (req) => {
        const customerId = req.params.customerId;
        const result = await behaviorPredictionService.fullProfile(customerId);
        return result;
    }),
};
