import { prisma } from "../../prisma/client.ts";

export async function health(_req, res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(503).json({
      status: "error",
      message: "Database unreachable"
    });
  }
}

export async function deepHealth(_req, res) {
  const checks: Record<string, string> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  checks.redis = process.env.REDIS_URL?.startsWith("redis://")
    ? "configured"
    : "not_configured";

  checks.push =
    process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
      ? "configured"
      : "not_configured";

  const healthy = checks.database === "ok";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    checks
  });
}
