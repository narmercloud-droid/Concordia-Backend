import { behaviorPredictionService } from "../services/behaviorPrediction.service.js";
import { NextFunction, Request, Response } from "express";

export const BehaviorPredictionController = {
  profile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.customerId as string;
      const result = await behaviorPredictionService.fullProfile(customerId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


