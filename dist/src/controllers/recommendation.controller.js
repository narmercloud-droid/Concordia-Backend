import { recommendationService } from "../services/recommendation.service.js";
export const RecommendationController = {
    recommend: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { branchId } = req.query;
            const rec = await recommendationService.recommend(customerId, branchId);
            res.json(rec);
        }
        catch (err) {
            next(err);
        }
    }
};
