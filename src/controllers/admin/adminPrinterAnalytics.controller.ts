import { getPrinterAnalytics } from "../../services/printer/printerAnalytics.service.ts";
import { wrap } from "../../contracts/api.js";

export const getPrinterAnalyticsController = wrap(async () => {
  const data = await getPrinterAnalytics();
  return data;
});

