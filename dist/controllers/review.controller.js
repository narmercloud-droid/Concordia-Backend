import { reviewService } from "../services/review.service.js";
import { success } from "./controllerHelper.js";
export const ReviewController = {
    submit: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const review = await reviewService.submitReview(customerId, req.body);
            return success(res, review);
        }
        catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { reviewId } = req.params;
            const updated = await reviewService.updateReview(customerId, reviewId, req.body);
            return success(res, updated);
        }
        catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const { reviewId } = req.params;
            await reviewService.deleteReview(customerId, reviewId);
            return success(res, { success: true });
        }
        catch (err) {
            next(err);
        }
    },
    rateItem: async (req, res, next) => {
        try {
            const { orderItemId, rating } = req.body;
            const result = await reviewService.rateItem(orderItemId, rating);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    branchReviews: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const reviews = await reviewService.listBranchReviews(branchId);
            return success(res, reviews);
        }
        catch (err) {
            next(err);
        }
    },
    branchRating: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const rating = await reviewService.branchRating(branchId);
            return success(res, rating);
        }
        catch (err) {
            next(err);
        }
    }
};
