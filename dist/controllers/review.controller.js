import { reviewService } from "../services/review.service.js";
import { success, fail } from "./controllerHelper.js";
import { reviewBodySchema, reviewRatingBodySchema } from "../validation/review.schema.js";
import { reviewIdParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const ReviewController = {
    submit: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = reviewBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const review = await reviewService.submitReview(customerId, parsed.data);
            return success(res, review, "Review submitted");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    update: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsedParams = reviewIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = reviewBodySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const updated = await reviewService.updateReview(customerId, parsedParams.data.reviewId, parsedBody.data);
            return success(res, updated, "Review updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    delete: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsedParams = reviewIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            await reviewService.deleteReview(customerId, parsedParams.data.reviewId);
            return success(res, { success: true }, "Review deleted");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    rateItem: async (req, res, next) => {
        try {
            const parsed = reviewRatingBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { orderItemId, rating } = parsed.data;
            const result = await reviewService.rateItem(orderItemId, rating);
            return success(res, result, "Item rated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    branchReviews: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const reviews = await reviewService.listBranchReviews(branchId);
            return success(res, reviews, "Branch reviews");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    branchRating: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const rating = await reviewService.branchRating(branchId);
            return success(res, rating, "Branch rating");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
