import { checkAllPrinters } from "../../services/printer/printerStatus.service.ts";
import { wrap } from "../../contracts/api.js";

export const getPrinterStatus = wrap(async () => {
  const status = await checkAllPrinters();
  return status;
});

