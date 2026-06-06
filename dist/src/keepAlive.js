import { prisma } from "./prisma/client.js";
import logger from "./logger.js";
export function startNeonKeepAlive() {
    setInterval(async () => {
        try {
            await prisma.$queryRaw `SELECT 1`;
            logger.info("Neon keep-alive ping sent");
        }
        catch (err) {
            logger.warn({ err }, "Neon keep-alive failed");
        }
    }, 1000 * 60 * 4); // every 4 minutes
}
