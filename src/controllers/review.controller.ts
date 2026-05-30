import type { AuthenticatedRequest } from "../globalTypes.js";
import type { Response, NextFunction  } from "express";
import { reviewService } from "../services/review.service.js";
import { success } from "./controllerHelper.js";

export const ReviewController = {
  submit: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const review = await reviewService.submitReview(customerId, req.body);
      return success(res, review);
    } catch (err: unknown) {
      next(err);
    }
  },

  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      const updated = await reviewService.updateReview(customerId, reviewId, req.body);
      return success(res, updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      await reviewService.deleteReview(customerId, reviewId);
      return success(res, { success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  rateItem: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderItemId, rating } = req.body;
      const result = await reviewService.rateItem(orderItemId, rating);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },

  branchReviews: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const reviews = await reviewService.listBranchReviews(branchId);
      return success(res, reviews);
    } catch (err: unknown) {
      next(err);
    }
  },

  branchRating: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const rating = await reviewService.branchRating(branchId);
      return success(res, rating);
    } catch (err: unknown) {
      next(err);
    }
  }
};






