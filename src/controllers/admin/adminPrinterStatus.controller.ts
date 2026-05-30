import { checkAllPrinters } from "../../services/printer/printerStatus.service.js";
import { success } from "../controllerHelper.js";

export const getPrinterStatus = async (req, res) => {
  const status = await checkAllPrinters();
  return success(res, status);
};

