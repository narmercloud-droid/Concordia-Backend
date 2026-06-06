import type { Request } from "express";
import { forecastingService } from "../services/forecasting.service.ts";
import { wrap } from "../contracts/api.js";

export const ForecastingController = {
  fullForecast: wrap(async (req: Request) => {
    const branchId = req.user!.branchId;
    const result = await forecastingService.fullForecast(branchId);
    return result;
  }),
};







