import { discoverPrinters, addDiscoveredPrinter } from "../services/printer/printerDiscovery.service.ts";
import { registerPrinter, verifyPrinter } from "../services/printer/printerSecurity.service.ts";
import logger from "../logger.ts";

export function startPrinterDiscoveryWorker() {
  const timer = setInterval(async () => {
    discoverPrinters(async (printer) => {
      const verified = await verifyPrinter(printer);

      if (!verified) {
        await registerPrinter(printer);
        logger.info({ printer }, "Printer registered but NOT approved");
        return;
      }

      addDiscoveredPrinter("B", printer); // Auto-assign to Kitchen B
      logger.info({ printer }, "Discovered printer");
    });
  }, 10000); // every 10 seconds

  return timer;
}

