"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTerminalStatusJob = startTerminalStatusJob;
const client_1 = require("../prisma/client");
function startTerminalStatusJob() {
    setInterval(async () => {
        try {
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            const result = await client_1.prisma.branchTerminal.updateMany({
                where: {
                    last_seen: {
                        lt: twoMinutesAgo,
                    },
                    is_online: true,
                },
                data: {
                    is_online: false,
                },
            });
            if (result.count > 0) {
                console.log(`Cleanup job: Marked ${result.count} terminals offline`);
            }
        }
        catch (err) {
            console.error("Terminal status cleanup job error:", err.message);
        }
    }, 60 * 1000); // Every 60 seconds
    console.log("Terminal status cleanup job started");
}
