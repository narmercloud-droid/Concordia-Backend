import { reviewService } from "../services/review.service.js";
export const ReviewController = {
    submit: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const review = await reviewService.submitReview(customerId, req.body);
            res.json(review);
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
            res.json(updated);
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
            res.json({ success: true });
        }
        catch (err) {
            next(err);
        }
    },
    rateItem: async (req, res, next) => {
        try {
            const { orderItemId, rating } = req.body;
            const result = await reviewService.rateItem(orderItemId, rating);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
    branchReviews: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const reviews = await reviewService.listBranchReviews(branchId);
            res.json(reviews);
        }
        catch (err) {
            next(err);
        }
    },
    branchRating: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const rating = await reviewService.branchRating(branchId);
            res.json(rating);
        }
        catch (err) {
            next(err);
        }
    }
};
