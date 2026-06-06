import { getCloudPrinters } from "../../services/printer/printerCloudSync.service.js";
import { wrap } from "../../contracts/api.js";
export const listCloudPrinters = wrap(async () => {
    const printers = await getCloudPrinters();
    return printers;
});
