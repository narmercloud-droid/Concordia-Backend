import { prisma } from "./prisma/client.js";
import logger from "./logger.js";
import { warmCustomerCaches } from "./jobs/cacheWarmup.js";
const PING_INTERVAL_MS = 1000 * 60 * 3; // Neon suspends after ~5 min idle
const CACHE_WARM_EVERY_N = 2;
let pingCount = 0;
export function startNeonKeepAlive() {
    const run = async () => {
        try {
            await prisma.$queryRaw `SELECT 1`;
            pingCount += 1;
            if (pingCount % CACHE_WARM_EVERY_N === 0) {
                await warmCustomerCaches();
            }
            logger.debug("Neon keep-alive ping sent");
        }
        catch (err) {
            logger.warn({ err }, "Neon keep-alive failed");
        }
    };
    void run();
    setInterval(run, PING_INTERVAL_MS);
}
