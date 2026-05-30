import { prisma } from "../../prisma/client.js";
import { approvePrinter } from "../../services/printer/printerSecurity.service.js";
import { success } from "../controllerHelper.js";

export const listUnapprovedPrinters = async (req, res) => {
  const printers = await prisma.printerSecurity.findMany({
    where: { approved: false }
  });
  return success(res, printers);
};

export const approvePrinterController = async (req, res) => {
  const { id } = req.params;
  const updated = await approvePrinter(Number(id));
  return success(res, updated);
};

