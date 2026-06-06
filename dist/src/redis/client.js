import { createClient } from "redis";
import logger from "../utils/logger.js";
import { env } from "../config/env.js";
const isRedisUrl = typeof env.REDIS_URL === "string" && (env.REDIS_URL.startsWith("redis://") || env.REDIS_URL.startsWith("rediss://"));
let redisClient;
if (isRedisUrl) {
    redisClient = createClient({
        url: env.REDIS_URL,
        socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        },
        commandsQueueMaxLength: 10000
    });
    redisClient.on("error", (error) => {
        logger.error({ err: error }, "Redis client error");
    });
    redisClient.on("connect", () => {
        logger.info("Redis client connecting");
    });
    redisClient.on("ready", () => {
        logger.info("Redis client ready");
    });
}
else {
    // Export a noop stub when REDIS_URL is not a redis:// URL (development fallback)
    logger.warn("REDIS_URL does not appear to be a redis:// URL — Redis disabled locally");
    const noop = async () => undefined;
    const stub = {
        connect: async () => undefined,
        on: () => undefined,
        get: async () => null,
        set: async () => undefined,
        setEx: async () => undefined,
        del: async () => undefined,
        keys: async () => [],
        multi: () => ({ exec: async () => [] }),
        exec: async () => [],
    };
    redisClient = stub;
}
export const connectRedis = async () => {
    try {
        if (!isRedisUrl) {
            logger.info("Skipping Redis connect because REDIS_URL is not a redis:// URL");
            return;
        }
        try {
            await redisClient.connect();
            logger.info("Connected to Redis");
        }
        catch (err) {
            logger.warn({ err }, "Redis connection failed — continuing without Redis");
        }
    }
    catch (error) {
        logger.error({ err: error }, "Failed to connect to Redis");
    }
};
export default redisClient;
