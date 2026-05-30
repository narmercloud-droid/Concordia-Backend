import { getPrinterAnalytics } from "../../services/printer/printerAnalytics.service.js";
import { success } from "../controllerHelper.js";
export const getPrinterAnalyticsController = async (req, res) => {
    const data = await getPrinterAnalytics();
    return success(res, data);
};
