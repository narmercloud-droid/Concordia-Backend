import { prisma } from "../../prisma/client.ts";
import { approvePrinter } from "../../services/printer/printerSecurity.service.ts";
import { wrap } from "../../contracts/api.js";

export const listUnapprovedPrinters = wrap(async () => {
  const printers = await prisma.printerSecurity.findMany({
    where: { approved: false }
  });
  return printers;
});

export const approvePrinterController = wrap(async (req) => {
  const { id } = req.params;
  const updated = await approvePrinter(Number(id));
  return updated;
});

