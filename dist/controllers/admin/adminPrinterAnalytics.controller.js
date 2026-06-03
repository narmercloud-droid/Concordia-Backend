import { getPrinterAnalytics } from "../../services/printer/printerAnalytics.service.js";
import { wrap } from "../../contracts/api.js";
export const getPrinterAnalyticsController = wrap(async () => {
    const data = await getPrinterAnalytics();
    return data;
});
