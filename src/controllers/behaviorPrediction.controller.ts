import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import { NextFunction, Request, Response } from "express";
import { success, fail } from "./controllerHelper.js";
import { customerIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const BehaviorPredictionController = {
  profile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const result = await behaviorPredictionService.fullProfile(parsed.data.customerId);
      return success(res, result, "Profile fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
