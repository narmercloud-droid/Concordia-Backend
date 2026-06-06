import { checkAllPrinters } from "../../services/printer/printerStatus.service.js";
import { wrap } from "../../contracts/api.js";
export const getPrinterStatus = wrap(async () => {
    const status = await checkAllPrinters();
    return status;
});
