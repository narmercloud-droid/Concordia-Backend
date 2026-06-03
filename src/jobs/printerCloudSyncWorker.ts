import { syncPrintersToCloud } from "../services/printer/printerCloudSync.service.ts";
import { prisma } from "../prisma/client.ts";
import logger from "../logger.ts";

export async function startPrinterSyncWorker() {
  await prisma.$connect();
  logger.info("Printer sync worker starting");

  const timer = setInterval(async () => {
    try {
      await syncPrintersToCloud(process.env.PRINTER_BRANCH_ID || "branch-001");
    } catch (err) {
      logger.error({ err }, "Printer sync failed");
    }
  }, 60_000);

  return timer;
}

