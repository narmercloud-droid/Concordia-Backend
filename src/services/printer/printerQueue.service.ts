import { prisma } from "../../prisma/client.ts";
import { printKitchenTicket } from "./printer.service.ts";
import { selectPrinter } from "./printerSelector.service.ts";
import { verifyPrinter, markTampered } from "./printerSecurity.service.ts";
import { recordTrace, updateHealth, recordAnomaly } from "./printerObservability.service.ts";

export async function enqueuePrintJob(kitchen, order, items) {
  return prisma.printerQueue.create({
    data: {
      kitchen,
      payload: { order, items }
    }
  });
}

export async function processPrintJob(job) {
  try {
    const { payload } = job;
    const start = Date.now();
    const printer = selectPrinter(job.kitchen);

    const isVerified = await verifyPrinter(printer);
    if (!isVerified) {
      await markTampered(printer);
      throw new Error("Printer not authorized");
    }

    await recordTrace(printer, "print_start");
    await printKitchenTicket(printer, payload.order, payload.items);

    const duration = Date.now() - start;

    await prisma.printerQueue.update({
      where: { id: job.id },
      data: {
        status: "success",
        printedAt: new Date(),
        durationMs: duration
      }
    });

    await recordTrace(printer, "print_success", duration);
    await updateHealth(printer, +1);

    return true;
  } catch (err) {
    await prisma.printerQueue.update({
      where: { id: job.id },
      data: {
        attempts: job.attempts + 1,
        lastError: err.message,
        status: job.attempts + 1 >= job.maxAttempts ? "failed" : "pending"
      }
    });

    await recordTrace(job.printerId, "print_failure");
    await updateHealth(job.printerId, -5);
    await recordAnomaly(job.printerId, "print_failure", 3);

    return false;
  }
}

export async function processPendingJobs() {
  const jobs = await prisma.printerQueue.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" }
  });

  for (const job of jobs) {
    await processPrintJob(job);
  }
}

