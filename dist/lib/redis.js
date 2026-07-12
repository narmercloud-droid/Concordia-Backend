import { createClient } from "redis";
import { env } from "../config/env.js";
import { trackRedisOperation, trackRedisOperationError, trackCacheHit } from "../metrics/metrics.js";
import { getCurrentRequestProfile } from "./profile.js";
import logger from "../logger.js";
const redisUrl = String(env.REDIS_URL || "").trim();
const isRedisUrlValid = redisUrl.length > 0 && redisUrl.startsWith("redis://");
let client;
let redisEnabled = false;
if (isRedisUrlValid) {
    redisEnabled = true;
    client = createClient({
        url: redisUrl,
        // Performance tuning
        socket: {
            reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
        // Use a larger command queue for heavy bursts and pipelining throughput
        commandsQueueMaxLength: 10000,
    });
    if (client.on)
        client.on("error", (err) => logger.error({ err }, "Redis Client Error"));
}
else {
    redisEnabled = false;
    logger.warn({ REDIS_URL: redisUrl }, "Redis disabled: REDIS_URL missing or invalid; continuing without Redis");
    // Stub client with the subset of methods used by the app
    const pipelineStub = () => {
        const p = {
            commands: [],
            setEx(k, ttl, v) {
                this.commands.push(["setEx", k, ttl, v]);
                return this;
            },
            set(k, v) {
                this.commands.push(["set", k, v]);
                return this;
            },
            get(k) {
                this.commands.push(["get", k]);
                return this;
            },
            del(k) {
                this.commands.push(["del", k]);
                return this;
            },
            async exec() {
                return [];
            },
        };
        return p;
    };
    client = {
        connect: async () => { },
        get: async (_k) => null,
        set: async (_k, _v) => "OK",
        setEx: async (_k, _ttl, _v) => "OK",
        del: async (_k) => 0,
        keys: async (_pattern) => [],
        scan: async (_cursor, _opts) => ({
            cursor: 0,
            keys: []
        }),
        multi: () => pipelineStub(),
        // Some code may call .on; provide a no-op
        on: (_ev, _cb) => { },
    };
}
export const connectRedis = async () => {
    if (!redisEnabled) {
        return;
    }
    try {
        await client.connect();
        logger.info("Connected to Redis");
    }
    catch (error) {
        logger.error({ error }, "Failed to connect to Redis");
    }
};
export const getCache = async (key) => {
    const start = Date.now();
    try {
        const value = await client.get(key);
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("GET", duration, true);
        const profile = getCurrentRequestProfile();
        if (profile) {
            profile.redisQueryNs += (Date.now() - start) * 1e6;
        }
        if (value) {
            trackCacheHit(key);
        }
        return typeof value === "string" ? value : value?.toString() ?? null;
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("GET", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("GET", errorType);
        logger.error({ error, key }, "Redis GET error");
        return null;
    }
};
export const setCache = async (key, value, ttl) => {
    const start = Date.now();
    try {
        if (ttl) {
            await client.setEx(key, ttl, value);
        }
        else {
            await client.set(key, value);
        }
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("SET", duration, true);
        const profile = getCurrentRequestProfile();
        if (profile) {
            profile.redisQueryNs += (Date.now() - start) * 1e6;
        }
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("SET", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("SET", errorType);
        logger.error({ error, key }, "Redis SET error");
    }
};
export const deleteCache = async (key) => {
    const start = Date.now();
    try {
        await client.del(key);
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("DEL", duration, true);
        const profile = getCurrentRequestProfile();
        if (profile) {
            profile.redisQueryNs += (Date.now() - start) * 1e6;
        }
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("DEL", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("DEL", errorType);
        logger.error({ error, key }, "Redis DEL error");
    }
};
export const clearCache = async (pattern) => {
    const start = Date.now();
    try {
        const keys = [];
        let cursor = 0;
        do {
            const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
            cursor = result.cursor;
            keys.push(...result.keys);
        } while (cursor !== 0);
        if (keys.length > 0) {
            await client.del(keys);
        }
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("CLEAR", duration, true);
        const profile = getCurrentRequestProfile();
        if (profile) {
            profile.redisQueryNs += (Date.now() - start) * 1e6;
        }
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("CLEAR", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("CLEAR", errorType);
        logger.error({ error, pattern }, "Redis CLEAR error");
    }
};
// ===== BATCH OPERATIONS WITH PIPELINING =====
export const batchSet = async (entries) => {
    const start = Date.now();
    try {
        const pipeline = client.multi();
        for (const { key, value, ttl } of entries) {
            if (ttl) {
                pipeline.setEx(key, ttl, value);
            }
            else {
                pipeline.set(key, value);
            }
        }
        await pipeline.exec();
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_SET", duration, true);
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_SET", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("BATCH_SET", errorType);
        logger.error({ error }, "Redis batch SET error");
    }
};
export const batchGet = async (keys) => {
    const start = Date.now();
    try {
        const pipeline = client.multi();
        for (const key of keys) {
            pipeline.get(key);
        }
        const results = await pipeline.exec();
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_GET", duration, true);
        if (!Array.isArray(results)) {
            return keys.map(() => null);
        }
        return results.map((result) => {
            if (result === null || result === undefined)
                return null;
            return typeof result === "string" ? result : result instanceof Buffer ? result.toString() : String(result);
        });
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_GET", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("BATCH_GET", errorType);
        logger.error({ error }, "Redis batch GET error");
        return keys.map(() => null);
    }
};
export const batchDelete = async (keys) => {
    const start = Date.now();
    try {
        if (keys.length > 0) {
            const pipeline = client.multi();
            for (const key of keys) {
                pipeline.del(key);
            }
            await pipeline.exec();
        }
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_DEL", duration, true);
    }
    catch (error) {
        const duration = (Date.now() - start) / 1000;
        trackRedisOperation("BATCH_DEL", duration, false);
        const errorType = error instanceof Error ? error.constructor.name : "unknown";
        trackRedisOperationError("BATCH_DEL", errorType);
        logger.error({ error }, "Redis batch DELETE error");
    }
};
// ===== CACHE KEYS AND TTL =====
export const CACHE_KEYS = {
    // AI endpoints
    CHURN_PREDICTION: (customerId) => `ai:churn:${customerId}`,
    TOP_MENU: (branchId, limit) => `ai:menu:top:${branchId}:${limit}`,
    DEMAND_FORECAST: (branchId, hours) => `ai:demand:${branchId}:${hours}`,
    BEHAVIOR_ANALYTICS: (customerId) => `ai:behavior:${customerId}`,
    PRICE_OPTIMIZATION: (branchId) => `ai:pricing:${branchId}`,
    // Dashboard metrics
    DASHBOARD_METRICS: (branchId) => `dashboard:${branchId}`,
    ORDER_STATS: (branchId, period) => `dashboard:orders:${branchId}:${period}`,
    REVENUE_STATS: (branchId, period) => `dashboard:revenue:${branchId}:${period}`,
    CUSTOMER_STATS: (branchId, period) => `dashboard:customers:${branchId}:${period}`,
    // Menu data
    MENU_ITEMS: (branchId) => `menu:items:${branchId}`,
    MENU_CATEGORIES: (branchId) => `menu:categories:${branchId}`,
    // Branch demand
    BRANCH_DEMAND: (branchId) => `demand:${branchId}`,
    BRANCH_DEMAND_HOUR: (branchId, hour) => `demand:${branchId}:${hour}`,
};
export const CACHE_TTL = {
    AI_PREDICTION: 30, // 30 seconds
    DASHBOARD_METRICS: 5, // 5 seconds
    MENU_DATA: 60, // 60 seconds (1 minute)
    BRANCH_DEMAND: 30, // 30 seconds
    BEHAVIOR_DATA: 60, // 60 seconds
    ORDER_STATS: 10, // 10 seconds
};
// ===== CACHE HELPERS =====
export const cacheChurnPrediction = async (customerId, score, totalOrders, totalSpend, lastOrderDate, ttl = CACHE_TTL.AI_PREDICTION) => {
    const key = CACHE_KEYS.CHURN_PREDICTION(customerId);
    await setCache(key, JSON.stringify({ score, totalOrders, totalSpend, lastOrderDate, timestamp: Date.now() }), ttl);
};
export const getChurnPrediction = async (customerId) => {
    const key = CACHE_KEYS.CHURN_PREDICTION(customerId);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export const cacheDashboardMetrics = async (branchId, metrics, ttl = CACHE_TTL.DASHBOARD_METRICS) => {
    const key = CACHE_KEYS.DASHBOARD_METRICS(branchId);
    await setCache(key, JSON.stringify(metrics), ttl);
};
export const getDashboardMetrics = async (branchId) => {
    const key = CACHE_KEYS.DASHBOARD_METRICS(branchId);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export const cacheMenuItems = async (branchId, items, ttl = CACHE_TTL.MENU_DATA) => {
    const key = CACHE_KEYS.MENU_ITEMS(branchId);
    await setCache(key, JSON.stringify(items), ttl);
};
export const getMenuItems = async (branchId) => {
    const key = CACHE_KEYS.MENU_ITEMS(branchId);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export const cacheTopMenuItems = async (branchId, limit, items, ttl = CACHE_TTL.AI_PREDICTION) => {
    const key = CACHE_KEYS.TOP_MENU(branchId, limit);
    await setCache(key, JSON.stringify(items), ttl);
};
export const getTopMenuItems = async (branchId, limit) => {
    const key = CACHE_KEYS.TOP_MENU(branchId, limit);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export const cacheBranchDemandForecast = async (branchId, hours, forecast, ttl = CACHE_TTL.AI_PREDICTION) => {
    const key = CACHE_KEYS.DEMAND_FORECAST(branchId, hours);
    await setCache(key, JSON.stringify(forecast), ttl);
};
export const getBranchDemandForecast = async (branchId, hours) => {
    const key = CACHE_KEYS.DEMAND_FORECAST(branchId, hours);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export const cacheBranchDemand = async (branchId, demand, ttl = CACHE_TTL.BRANCH_DEMAND) => {
    const key = CACHE_KEYS.BRANCH_DEMAND(branchId);
    await setCache(key, JSON.stringify(demand), ttl);
};
export const getBranchDemand = async (branchId) => {
    const key = CACHE_KEYS.BRANCH_DEMAND(branchId);
    const data = await getCache(key);
    return data ? JSON.parse(data) : null;
};
export { client as redisClient };
