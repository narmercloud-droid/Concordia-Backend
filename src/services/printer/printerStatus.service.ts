import net from "net";
import { kitchenPrinters } from "../../config/printers.ts";

export async function checkPrinterStatus(kitchen) {
  const cfg = kitchenPrinters[kitchen];
  if (!cfg) return null;

  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(2000);

    socket
      .connect(cfg.port, cfg.host, () => {
        cfg.status.online = true;
        cfg.status.lastCheck = new Date();
        cfg.status.lastSuccess = new Date();
        socket.destroy();
        resolve(cfg.status);
      })
      .on("error", (err) => {
        cfg.status.online = false;
        cfg.status.lastCheck = new Date();
        cfg.status.lastError = err.message;
        resolve(cfg.status);
      })
      .on("timeout", () => {
        cfg.status.online = false;
        cfg.status.lastCheck = new Date();
        cfg.status.lastError = "Timeout";
        socket.destroy();
        resolve(cfg.status);
      });
  });
}

export async function checkAllPrinters() {
  const results = {};
  for (const k of Object.keys(kitchenPrinters)) {
    if (kitchenPrinters[k]) {
      results[k] = await checkPrinterStatus(k);
    }
  }
  return results;
}

