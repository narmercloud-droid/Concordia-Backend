import { recommendationService } from "../services/recommendation.service.js";
import { success, fail } from "./controllerHelper.js";
import { recommendationQuerySchema } from "../validation/recommendation.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const RecommendationController = {
    recommend: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = recommendationQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId } = parsed.data;
            const rec = await recommendationService.recommend(customerId, branchId);
            return success(res, rec, "Recommendations fetched successfully");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
