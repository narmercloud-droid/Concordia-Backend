import { prisma } from "./prisma/client.ts";
import logger from "./logger.ts";

export function startNeonKeepAlive() {
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.debug("Neon keep-alive ping sent");
    } catch (err: any) {
      logger.warn({ err }, "Neon keep-alive failed");
    }
  }, 1000 * 60 * 4); // every 4 minutes
}
