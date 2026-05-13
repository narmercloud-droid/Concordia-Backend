import { prisma } from "../prisma/client.js";

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
        console.log(`Cleanup job: Marked ${result.count} terminals offline`);
      }
    } catch (err: any) {
      console.error("Terminal status cleanup job error:", err.message);
    }
  }, 60 * 1000); // Every 60 seconds

  console.log("Terminal status cleanup job started");
}
