import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import { success, fail } from "./controllerHelper.js";
import { customerIdParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const BehaviorPredictionController = {
    profile: async (req, res, next) => {
        try {
            const parsed = customerIdParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const result = await behaviorPredictionService.fullProfile(parsed.data.customerId);
            return success(res, result, "Profile fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
