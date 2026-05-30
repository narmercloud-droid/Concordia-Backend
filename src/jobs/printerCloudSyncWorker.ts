import { syncPrintersToCloud } from "../services/printer/printerCloudSync.service.js";
import { prisma } from "../prisma/client.js";

export async function startPrinterSyncWorker() {
  await prisma.$connect();
  console.log("Printer sync worker starting…");

  setInterval(async () => {
    try {
      await syncPrintersToCloud(process.env.PRINTER_BRANCH_ID || "branch-001");
    } catch (err) {
      console.error("Printer sync failed:", err);
    }
  }, 60_000);
}

