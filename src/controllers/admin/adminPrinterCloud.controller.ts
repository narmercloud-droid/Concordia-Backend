import { getCloudPrinters } from "../../services/printer/printerCloudSync.service.js";
import { success } from "../controllerHelper.js";

export const listCloudPrinters = async (req, res) => {
  const printers = await getCloudPrinters();
  return success(res, printers);
};

