import { recommendationService } from "../services/recommendation.service.js";
import { success } from "./controllerHelper.js";
export const RecommendationController = {
    recommend: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { branchId } = req.query;
            const rec = await recommendationService.recommend(customerId, branchId);
            return success(res, rec);
        }
        catch (err) {
            next(err);
        }
    }
};
