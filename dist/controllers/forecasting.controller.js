import { forecastingService } from "../services/forecasting.service.js";
import { success, fail } from "./controllerHelper.js";
export const ForecastingController = {
    fullForecast: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await forecastingService.fullForecast(branchId);
            return success(res, result, "Forecast complete");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
