import { processPendingJobs } from "../services/printer/printerQueue.service.ts";

export function startPrinterQueueWorker() {
  setInterval(async () => {
    await processPendingJobs();
  }, 5000); // every 5 seconds
}

