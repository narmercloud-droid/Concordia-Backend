import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { recommendationService } from "../services/recommendation.service.js";
import { success, fail } from "./controllerHelper.js";
import { recommendationQuerySchema } from "../validation/recommendation.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const RecommendationController = {
  recommend: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.id;
      const parsed = recommendationQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;

      const rec = await recommendationService.recommend(customerId, branchId);
      return success(res, rec, "Recommendations fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};

