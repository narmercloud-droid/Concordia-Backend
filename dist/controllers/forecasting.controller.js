import { forecastingService } from "../services/forecasting.service.js";
import { wrap } from "../contracts/api.js";
export const ForecastingController = {
    fullForecast: wrap(async (req) => {
        const branchId = req.user.branchId;
        const result = await forecastingService.fullForecast(branchId);
        return result;
    }),
};
