import { forecastingService } from "../services/forecasting.service.js";
export const ForecastingController = {
    fullForecast: async (req, res, next) => {
        try {
            const branchId = req.user.branchId;
            const result = await forecastingService.fullForecast(branchId);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};
