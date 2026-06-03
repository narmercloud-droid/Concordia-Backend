import { behaviorPredictionService } from "../services/behaviorPrediction.service.ts";
import type { Request } from "express";
import { wrap } from "./../contracts/api.js";

export const BehaviorPredictionController = {
  profile: wrap(async (req: Request) => {
    const customerId = req.params.customerId as string;
    const result = await behaviorPredictionService.fullProfile(customerId);
    return result;
  }),
};







