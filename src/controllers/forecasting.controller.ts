import { forecastingService } from "../services/forecasting.service.js";
import { NextFunction, Request, Response } from "express";

export const ForecastingController = {
  fullForecast: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const result = await forecastingService.fullForecast(branchId);
      res.json(result);
    } catch (err: unknown) {
      next(err);
    }
  },
};


