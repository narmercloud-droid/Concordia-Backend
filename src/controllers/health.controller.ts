import type { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "../lib/redis.ts";
import logger from "../lib/logger.ts";
import { wrap, fail } from "../contracts/api.js";

const prisma = new PrismaClient();

export const HealthController = {
  async liveness(_req: Request) {
    return { status: "ok" };
  },

  readiness: wrap(async (_req: Request) => {
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
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = "up";
    } catch (error) {
      healthCheck.services.database = "down";
      logger.error({ error }, "Database readiness check failed");
    }

    try {
      // Check Redis connection
      await redisClient.ping();
      healthCheck.services.redis = "up";
    } catch (error) {
      healthCheck.services.redis = "down";
      logger.error({ error }, "Redis readiness check failed");
    }

    try {
      // Check Socket.IO server status (basic check)
      const { getIO } = await import("../lib/socket.ts");
      const io = getIO();
      healthCheck.services.socketio = io ? "up" : "down";
    } catch (error) {
      healthCheck.services.socketio = "down";
      logger.error({ error }, "Socket.IO readiness check failed");
    }

    const isReady = Object.values(healthCheck.services).every(status => status === "up");

    if (isReady) {
      return healthCheck;
    } else {
      throw fail('SERVICE_UNAVAILABLE', 'One or more services are not ready');
    }
  }),

  comprehensive: wrap(async (_req: Request) => {
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
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = "up";
    } catch (error) {
      healthCheck.services.database = "down";
      logger.error({ error }, "Database health check failed");
    }

    try {
      // Check Redis connection
      await redisClient.ping();
      healthCheck.services.redis = "up";
    } catch (error) {
      healthCheck.services.redis = "down";
      logger.error({ error }, "Redis health check failed");
    }

    try {
      // Check Socket.IO server status
      const { getIO } = await import("../lib/socket.ts");
      const io = getIO();
      healthCheck.services.socketio = io ? "up" : "down";
    } catch (error) {
      healthCheck.services.socketio = "down";
      logger.error({ error }, "Socket.IO health check failed");
    }

    const isHealthy = Object.values(healthCheck.services).every(status => status === "up");

    if (isHealthy) {
      return healthCheck;
    } else {
      throw fail('SERVICE_UNAVAILABLE', 'One or more services are down');
    }
  })
};




