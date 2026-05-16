import { Request, Response, NextFunction } from "express";
import { recommendationService } from "../services/recommendation.service.js";

export const RecommendationController = {
  recommend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user.id;
      const { branchId } = req.query;

      const rec = await recommendationService.recommend(customerId, branchId);
      res.json(rec);
    } catch (err: unknown) {
      next(err);
    }
  }
};

