import { discoverPrinters, addDiscoveredPrinter } from "../services/printer/printerDiscovery.service.js";
import { registerPrinter, verifyPrinter } from "../services/printer/printerSecurity.service.js";
export function startPrinterDiscoveryWorker() {
    setInterval(async () => {
        discoverPrinters(async (printer) => {
            const verified = await verifyPrinter(printer);
            if (!verified) {
                await registerPrinter(printer);
                console.log("Printer registered but NOT approved:", printer);
                return;
            }
            addDiscoveredPrinter("B", printer); // Auto-assign to Kitchen B
            console.log("Discovered printer:", printer);
        });
    }, 10000); // every 10 seconds
}
