import { prisma } from "../../prisma/client.js";

export async function getPrinterAnalytics() {
  const total = await prisma.printerQueue.count();
  const success = await prisma.printerQueue.count({ where: { status: "success" } });
  const failed = await prisma.printerQueue.count({ where: { status: "failed" } });

  const avgDuration = await prisma.printerQueue.aggregate({
    _avg: { durationMs: true }
  });

  const last24h = await prisma.printerQueue.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  });

  const uptime = success / (success + failed);

  return {
    totalJobs: total,
    success,
    failed,
    uptime,
    avgDuration: avgDuration._avg.durationMs || 0,
    jobsLast24h: last24h
  };
}

