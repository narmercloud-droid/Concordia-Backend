import type { AuthenticatedRequest } from "../globalTypes.js";
import { Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";

export const ReviewController = {
  submit: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const review = await reviewService.submitReview(customerId, req.body);
      res.json(review);
    } catch (err: unknown) {
      next(err);
    }
  },

  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      const updated = await reviewService.updateReview(customerId, reviewId, req.body);
      res.json(updated);
    } catch (err: unknown) {
      next(err);
    }
  },

  delete: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { reviewId } = req.params;
      await reviewService.deleteReview(customerId, reviewId);
      res.json({ success: true });
    } catch (err: unknown) {
      next(err);
    }
  },

  rateItem: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { orderItemId, rating } = req.body;
      const result = await reviewService.rateItem(orderItemId, rating);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },

  branchReviews: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const reviews = await reviewService.listBranchReviews(branchId);
      res.json(reviews);
    } catch (err: unknown) {
      next(err);
    }
  },

  branchRating: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const rating = await reviewService.branchRating(branchId);
      res.json(rating);
    } catch (err: unknown) {
      next(err);
    }
  }
};

