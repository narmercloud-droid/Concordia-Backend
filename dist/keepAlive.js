import { prisma } from "./prisma/client.js";
import logger from "./logger.js";
import { warmCustomerCaches } from "./jobs/cacheWarmup.js";
/** Neon suspends compute after ~5 min idle — stay under that. */
const NEON_PING_INTERVAL_MS = 2 * 60 * 1000;
/** Render free tier spins down after ~15 min idle — self-ping before that. */
const RENDER_PING_INTERVAL_MS = 5 * 60 * 1000;
const CACHE_WARM_EVERY_N = 2;
let neonPingCount = 0;
export function startNeonKeepAlive() {
    const run = async () => {
        try {
            await prisma.$queryRaw `SELECT 1`;
            neonPingCount += 1;
            if (neonPingCount % CACHE_WARM_EVERY_N === 0) {
                await warmCustomerCaches();
            }
            logger.debug("Neon keep-alive ping sent");
        }
        catch (err) {
            logger.warn({ err }, "Neon keep-alive failed");
        }
    };
    void run();
    setInterval(run, NEON_PING_INTERVAL_MS);
}
/** When deployed on Render, hit our own /health so the web service stays warm overnight. */
export function startRenderKeepAlive() {
    const base = process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "");
    if (!base) {
        return;
    }
    const ping = async () => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            const res = await fetch(`${base}/health`, { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) {
                logger.warn({ status: res.status }, "Render self-ping returned non-OK");
            }
            else {
                logger.debug("Render self-ping OK");
            }
        }
        catch (err) {
            logger.warn({ err }, "Render self-ping failed");
        }
    };
    void ping();
    setInterval(ping, RENDER_PING_INTERVAL_MS);
    logger.info({ intervalMin: RENDER_PING_INTERVAL_MS / 60000 }, "Render self-ping started");
}
