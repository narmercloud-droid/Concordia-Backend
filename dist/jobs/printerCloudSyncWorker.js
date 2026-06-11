import { syncPrintersToCloud } from "../services/printer/printerCloudSync.service.js";
import { prisma } from "../prisma/client.js";
import logger from "../logger.js";
export async function startPrinterSyncWorker() {
    await prisma.$connect();
    logger.info("Printer sync worker starting");
    const timer = setInterval(async () => {
        try {
            await syncPrintersToCloud(process.env.PRINTER_BRANCH_ID || "concordia-kempen");
        }
        catch (err) {
            logger.error({ err }, "Printer sync failed");
        }
    }, 60000);
    return timer;
}
