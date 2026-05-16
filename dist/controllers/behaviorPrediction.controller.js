import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
export const BehaviorPredictionController = {
    profile: async (req, res, next) => {
        try {
            const customerId = req.params.customerId;
            const result = await behaviorPredictionService.fullProfile(customerId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
