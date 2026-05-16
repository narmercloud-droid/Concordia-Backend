import { forecastingService } from "../services/forecasting.service.js";
import { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { success, fail } from "./controllerHelper.js";

export const ForecastingController = {
  fullForecast: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user.branchId;
      const result = await forecastingService.fullForecast(branchId);
      return success(res, result, "Forecast complete");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
