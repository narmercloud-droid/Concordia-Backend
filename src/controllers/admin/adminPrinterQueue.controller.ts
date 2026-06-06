import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.js";

export const getPrinterQueue = wrap(async () => {
  const jobs = await prisma.printerQueue.findMany({
    orderBy: { createdAt: "desc" }
  });
  return jobs;
});

