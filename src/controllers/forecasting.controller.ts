import { forecastingService } from "../services/forecasting.service.js";
import type { NextFunction, Request, Response  } from "express";
import { success } from "./controllerHelper.js";

export const ForecastingController = {
  fullForecast: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await forecastingService.fullForecast(branchId);
      return success(res, result);
    } catch (err: unknown) {
      next(err);
    }
  },
};







