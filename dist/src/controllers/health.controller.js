import { PrismaClient } from "@prisma/client";
import { redisClient } from "../lib/redis.js";
import logger from "../lib/logger.js";
import { success, fail } from "./controllerHelper.js";
const prisma = new PrismaClient();
export const HealthController = {
    /**
     * GET /health/live
     * Basic liveness check - returns OK if service is running
     */
    async liveness(req, res) {
        return success(res, { status: "ok" }, "Service is alive");
    },
    /**
     * GET /health/ready
     * Readiness check - verifies all dependencies are available
     */
    async readiness(req, res) {
        const healthCheck = {
            uptime: process.uptime(),
            timestamp: Date.now(),
            services: {
                database: "unknown",
                redis: "unknown",
                socketio: "unknown"
            },
        };
        try {
            // Check database connection
            await prisma.$queryRaw `SELECT 1`;
            healthCheck.services.database = "up";
        }
        catch (error) {
            healthCheck.services.database = "down";
            logger.error({ error }, "Database readiness check failed");
        }
        try {
            // Check Redis connection
            await redisClient.ping();
            healthCheck.services.redis = "up";
        }
        catch (error) {
            healthCheck.services.redis = "down";
            logger.error({ error }, "Redis readiness check failed");
        }
        try {
            // Check Socket.IO server status (basic check)
            const { getIO } = await import("../lib/socket.js");
            const io = getIO();
            healthCheck.services.socketio = io ? "up" : "down";
        }
        catch (error) {
            healthCheck.services.socketio = "down";
            logger.error({ error }, "Socket.IO readiness check failed");
        }
        const isReady = Object.values(healthCheck.services).every(status => status === "up");
        if (isReady) {
            return success(res, healthCheck, "All services are ready");
        }
        else {
            return fail(res, "SERVICE_UNAVAILABLE", "One or more services are not ready", 503);
        }
    },
    /**
     * GET /health
     * Comprehensive health check (legacy endpoint)
     */
    async comprehensive(req, res) {
        const healthCheck = {
            uptime: process.uptime(),
            message: "OK",
            timestamp: Date.now(),
            services: {
                database: "unknown",
                redis: "unknown",
                socketio: "unknown"
            },
        };
        try {
            // Check database connection
            await prisma.$queryRaw `SELECT 1`;
            healthCheck.services.database = "up";
        }
        catch (error) {
            healthCheck.services.database = "down";
            logger.error({ error }, "Database health check failed");
        }
        try {
            // Check Redis connection
            await redisClient.ping();
            healthCheck.services.redis = "up";
        }
        catch (error) {
            healthCheck.services.redis = "down";
            logger.error({ error }, "Redis health check failed");
        }
        try {
            // Check Socket.IO server status
            const { getIO } = await import("../lib/socket.js");
            const io = getIO();
            healthCheck.services.socketio = io ? "up" : "down";
        }
        catch (error) {
            healthCheck.services.socketio = "down";
            logger.error({ error }, "Socket.IO health check failed");
        }
        const isHealthy = Object.values(healthCheck.services).every(status => status === "up");
        if (isHealthy) {
            return success(res, healthCheck, "Health check passed");
        }
        else {
            return fail(res, "SERVICE_UNAVAILABLE", "One or more services are down", 503);
        }
    }
};
