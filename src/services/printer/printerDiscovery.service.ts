import Bonjour from "bonjour";
import { kitchenPrinters } from "../../config/printers.ts";

const bonjour = new Bonjour();

export function discoverPrinters(callback) {
  bonjour.find({ type: "printer" }, (service) => {
    const ip = service.addresses.find(a => a.includes("."));
    const name = service.name;

    callback({
      id: name,
      host: ip,
      port: service.port
    });
  });
}

export function addDiscoveredPrinter(kitchen, printer) {
  if (!kitchenPrinters[kitchen]) kitchenPrinters[kitchen] = [];

  const exists = kitchenPrinters[kitchen].some(p => p.host === printer.host);

  if (!exists) {
    kitchenPrinters[kitchen].push({
      id: printer.id,
      type: "network",
      host: printer.host,
      port: printer.port,
      status: {
        online: false,
        lastCheck: null,
        lastSuccess: null,
        lastError: null
      }
    });
  }
}

