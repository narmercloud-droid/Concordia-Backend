import { recommendationService } from "../services/recommendation.service.js";
import { wrap } from "../contracts/api.js";
export const RecommendationController = {
    recommend: wrap(async (req) => {
        const customerId = req.user.id;
        const { branchId } = req.query;
        const rec = await recommendationService.recommend(customerId, branchId);
        return rec;
    })
};
