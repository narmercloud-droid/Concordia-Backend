import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import type { NextFunction, Request, Response  } from "express";
import { success } from "./controllerHelper.js";

export const BehaviorPredictionController = {
  profile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.customerId as string;
      const result = await behaviorPredictionService.fullProfile(customerId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







