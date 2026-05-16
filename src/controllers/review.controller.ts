import type { AuthenticatedRequest } from "../globalTypes.js";
import { Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { success, fail } from "./controllerHelper.js";
import { reviewBodySchema, reviewRatingBodySchema } from "../validation/review.schema.js";
import { reviewIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const ReviewController = {
  submit: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const parsed = reviewBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const review = await reviewService.submitReview(customerId, parsed.data);
      return success(res, review, "Review submitted");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
      const updated = await reviewService.updateReview(
        customerId,
        parsedParams.data.reviewId,
        parsedBody.data
      );
      return success(res, updated, "Review updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const parsedParams = reviewIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      await reviewService.deleteReview(customerId, parsedParams.data.reviewId);
      return success(res, { success: true }, "Review deleted");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  rateItem: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = reviewRatingBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderItemId, rating } = parsed.data;
      const result = await reviewService.rateItem(orderItemId, rating);
      return success(res, result, "Item rated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branchReviews: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const reviews = await reviewService.listBranchReviews(branchId);
      return success(res, reviews, "Branch reviews");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branchRating: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const rating = await reviewService.branchRating(branchId);
      return success(res, rating, "Branch rating");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
