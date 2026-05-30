import { forecastingService } from "../services/forecasting.service.js";
import { success } from "./controllerHelper.js";
export const ForecastingController = {
    fullForecast: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await forecastingService.fullForecast(branchId);
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
};
