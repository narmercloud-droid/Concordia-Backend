import redisClient from "./client.js";
import logger from "../logger.js";
const client = redisClient;
// Helper: get cached value by key (returns parsed JSON or null)
export async function getCache(key) {
    try {
        const val = await client.get(key);
        if (!val)
            return null;
        try {
            return JSON.parse(val);
        }
        catch (_e) {
            void _e;
            return val;
        }
    }
    catch (err) {
        logger.warn({ err, key }, "Redis getCache failed");
        return null;
    }
}
// Helper: set cache with optional ttl seconds
export async function setCache(key, value, ttlSeconds) {
    try {
        const str = typeof value === "string" ? value : JSON.stringify(value);
        if (ttlSeconds) {
            if (typeof client.setEx === "function") {
                await client.setEx(key, ttlSeconds, str);
            }
            else {
                await client.set(key, str);
                await client.expire(key, ttlSeconds);
            }
        }
        else {
            await client.set(key, str);
        }
    }
    catch (err) {
        logger.warn({ err, key }, "Redis setCache failed");
    }
}
export async function deleteCache(key) {
    try {
        await client.del(key);
    }
    catch (err) {
        logger.warn({ err, key }, "Redis deleteCache failed");
    }
}
// Graceful shutdown
try {
    process.on("SIGTERM", async () => {
        try {
            if (client && typeof client.quit === "function") {
                await client.quit();
                logger.info("Redis client quit on SIGTERM");
            }
            else if (client && typeof client.disconnect === "function") {
                await client.disconnect();
                logger.info("Redis client disconnected on SIGTERM");
            }
        }
        catch (err) {
            logger.warn({ err }, "Error during Redis shutdown (SIGTERM)");
        }
    });
    process.on("SIGINT", async () => {
        try {
            if (client && typeof client.quit === "function") {
                await client.quit();
                logger.info("Redis client quit on SIGINT");
            }
            else if (client && typeof client.disconnect === "function") {
                await client.disconnect();
                logger.info("Redis client disconnected on SIGINT");
            }
        }
        catch (err) {
            logger.warn({ err }, "Error during Redis shutdown (SIGINT)");
        }
    });
}
catch (e) {
    logger.warn({ e }, "Failed to register Redis shutdown handlers");
}
export default client;
