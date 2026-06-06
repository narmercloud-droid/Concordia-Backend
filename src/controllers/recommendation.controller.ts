import type { Request  } from "express";
import { recommendationService } from "../services/recommendation.service.ts";
import { wrap } from "../contracts/api.js";

export const RecommendationController = {
  recommend: wrap(async (req: Request) => {
    const customerId = req.user.id;
    const { branchId } = req.query;

    const rec = await recommendationService.recommend(customerId, branchId);
    return rec;
  })
};






