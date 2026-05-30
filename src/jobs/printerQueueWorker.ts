import { processPendingJobs } from "../services/printer/printerQueue.service.js";

export function startPrinterQueueWorker() {
  setInterval(async () => {
    await processPendingJobs();
  }, 5000); // every 5 seconds
}

