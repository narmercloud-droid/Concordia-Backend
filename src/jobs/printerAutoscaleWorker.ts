import { prisma } from "../prisma/client.ts";
import { scaleUp, scaleDown } from "../services/printer/printerAutoscale.service.ts";

export function startPrinterAutoscaleWorker() {
  setInterval(async () => {
    const pending = await prisma.printerQueue.count({
      where: { status: "pending" }
    });

    if (pending > 30) {
      await scaleUp("B");
    }

    if (pending < 5) {
      await scaleDown("B");
    }
  }, 7000); // every 7 seconds
}

