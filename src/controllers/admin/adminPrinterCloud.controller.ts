import { getCloudPrinters } from "../../services/printer/printerCloudSync.service.ts";
import { wrap } from "../../contracts/api.js";

export const listCloudPrinters = wrap(async () => {
  const printers = await getCloudPrinters();
  return printers;
});

