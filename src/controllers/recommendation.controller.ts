import type { Request, Response, NextFunction  } from "express";
import { recommendationService } from "../services/recommendation.service.js";
import { success } from "./controllerHelper.js";

export const RecommendationController = {
  recommend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { branchId } = req.query;

      const rec = await recommendationService.recommend(customerId, branchId);
      return success(res, rec);
    } catch (err: unknown) {
      next(err);
    }
  }
};






