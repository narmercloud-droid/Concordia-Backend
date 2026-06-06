import { prisma } from "../prisma/client.ts";
import logger from "../logger.ts";

export function startTerminalStatusJob() {
  setInterval(async () => {
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      const result = await prisma.terminal.updateMany({
        where: {
          lastSeen: {
            lt: twoMinutesAgo,
          },
          isOnline: true,
        },
        data: {
          isOnline: false,
        },
      });

      if (result.count > 0) {
        logger.info({ count: result.count }, "Cleanup job: Marked terminals offline");
      }
    } catch (err: any) {
      logger.error({ err }, "Terminal status cleanup job error");
    }
  }, 60 * 1000); // Every 60 seconds

  logger.info("Terminal status cleanup job started");
}




