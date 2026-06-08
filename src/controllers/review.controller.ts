import type { Request } from "express";
import type { AuthenticatedRequest } from "../globalTypes.ts";
import { reviewService } from "../services/review.service.ts";
import { wrap } from "../contracts/api.js";

export const ReviewController = {
  orderState: wrap(async (req: Request) => {
    return await reviewService.getOrderReviewState(req.params.orderId);
  }),

  submit: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.user.id;
    const review = await reviewService.submitReview(customerId, req.body);
    return review;
  }),

  submitGuest: wrap(async (req: Request) => {
    const review = await reviewService.submitGuestReview(req.body);
    return review;
  }),

  update: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.user.id;
    const { reviewId } = req.params;
    const updated = await reviewService.updateReview(customerId, reviewId, req.body);
    return updated;
  }),

  delete: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.user.id;
    const { reviewId } = req.params;
    await reviewService.deleteReview(customerId, reviewId);
    return { success: true };
  }),

  rateItem: wrap(async (req: AuthenticatedRequest) => {
    const { orderItemId, rating } = req.body;
    const result = await reviewService.rateItem(orderItemId, rating);
    return result;
  }),

  branchReviews: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user.branchId;
    const reviews = await reviewService.listBranchReviews(branchId);
    return reviews;
  }),

  branchRating: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user.branchId;
    const rating = await reviewService.branchRating(branchId);
    return rating;
  })
};
