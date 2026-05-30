import { prisma } from "../prisma/client.js";
import { recordAnomaly } from "../services/printer/printerObservability.service.js";

export function startPrinterSLAWorker() {
  setInterval(async () => {
    const slowJobs = await prisma.printerTrace.findMany({
      where: {
        event: "print_success",
        durationMs: { gt: 5000 }
      }
    });

    for (const job of slowJobs) {
      await recordAnomaly(
        { id: job.printerId },
        "sla_violation",
        2
      );
    }
  }, 10000);
}

