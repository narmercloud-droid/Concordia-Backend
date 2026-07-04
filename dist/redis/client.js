/** Re-use the shared Redis client so menu cache and rate limiting share one connection. */
import { connectRedis, redisClient } from "../lib/redis.js";
export { connectRedis };
export default redisClient;
