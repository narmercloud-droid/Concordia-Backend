import app from "./app.js";
import dotenv from "dotenv";
import prisma from "./prisma.js";
import logger from "./logger.js";
dotenv.config();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    logger.info({ port: PORT }, "Backend running");
});
const shutdown = async (signal) => {
    logger.info({ signal }, "Received shutdown signal. Shutting down gracefully...");
    server.close(async (err) => {
        if (err) {
            logger.error({ err }, "Error closing server");
            process.exit(1);
        }
        try {
            await prisma.$disconnect();
            logger.info("Prisma disconnected");
        }
        catch (e) {
            logger.error({ e }, "Error disconnecting prisma");
        }
        process.exit(0);
    });
    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
        logger.warn("Forcing shutdown");
        process.exit(1);
    }, 10000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
