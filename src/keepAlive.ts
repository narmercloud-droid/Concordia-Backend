import { prisma } from "./prisma/client.ts";
import logger from "./logger.ts";
import { warmCustomerCaches } from "./jobs/cacheWarmup.ts";

/** Neon suspends compute after ~5 min idle — stay under that. */
const NEON_PING_INTERVAL_MS = 2 * 60 * 1000;
/** Render free tier spins down after ~15 min idle — self-ping before that. */
const RENDER_PING_INTERVAL_MS = 5 * 60 * 1000;
const CACHE_WARM_EVERY_N = 2;
let neonPingCount = 0;

function envFlagEnabled(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/**
 * Keeps Neon compute awake (burns Free CU-hours). Opt-in only:
 * set NEON_KEEP_ALIVE=true on paid/always-on Neon.
 */
export function startNeonKeepAlive() {
  if (!envFlagEnabled("NEON_KEEP_ALIVE")) {
    logger.info("Neon keep-alive disabled (set NEON_KEEP_ALIVE=true to enable)");
    return;
  }

  const run = async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      neonPingCount += 1;
      if (neonPingCount % CACHE_WARM_EVERY_N === 0) {
        await warmCustomerCaches();
      }
      logger.debug("Neon keep-alive ping sent");
    } catch (err: unknown) {
      logger.warn({ err }, "Neon keep-alive failed");
    }
  };

  void run();
  setInterval(run, NEON_PING_INTERVAL_MS);
  logger.info({ intervalMin: NEON_PING_INTERVAL_MS / 60_000 }, "Neon keep-alive started");
}

/**
 * Keeps the Render web service warm. Pings `/` (no DB) by default so Neon can
 * scale to zero on the Free plan. Set RENDER_KEEP_ALIVE_PATH=/health only if
 * you intentionally want to wake the database.
 */
export function startRenderKeepAlive() {
  const base = process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "");
  if (!base) {
    return;
  }

  const path = process.env.RENDER_KEEP_ALIVE_PATH?.trim() || "/";
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const ping = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        logger.warn({ status: res.status, url }, "Render self-ping returned non-OK");
      } else {
        logger.debug({ url }, "Render self-ping OK");
      }
    } catch (err: unknown) {
      logger.warn({ err, url }, "Render self-ping failed");
    }
  };

  void ping();
  setInterval(ping, RENDER_PING_INTERVAL_MS);
  logger.info(
    { intervalMin: RENDER_PING_INTERVAL_MS / 60_000, url },
    "Render self-ping started"
  );
}
