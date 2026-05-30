import { prisma } from "./prisma/client.js";
export function startNeonKeepAlive() {
    setInterval(async () => {
        try {
            await prisma.$queryRaw `SELECT 1`;
            console.log("🔄 Neon keep-alive ping sent");
        }
        catch (err) {
            console.log("⚠️ Neon keep-alive failed:", err.message);
        }
    }, 1000 * 60 * 4); // every 4 minutes
}
