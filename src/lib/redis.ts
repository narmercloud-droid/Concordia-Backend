import { createClient } from "redis";
import { trackRedisOperation, trackRedisOperationError, trackCacheHit } from "../metrics/metrics.js";
import { getCurrentRequestProfile } from "./profile.js";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({
  url: redisUrl,
  // Performance tuning
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
  // Use a larger command queue for heavy bursts and pipelining throughput
  commandsQueueMaxLength: 10000,
});

client.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

export const getCache = async (key: string): Promise<string | null> => {
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
    return value;
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("GET", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("GET", errorType);
    console.error("Redis GET error:", error);
    return null;
  }
};

export const setCache = async (key: string, value: string, ttl?: number): Promise<void> => {
  const start = Date.now();
  try {
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("SET", duration, true);
    const profile = getCurrentRequestProfile();
    if (profile) {
      profile.redisQueryNs += (Date.now() - start) * 1e6;
    }
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("SET", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("SET", errorType);
    console.error("Redis SET error:", error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  const start = Date.now();
  try {
    await client.del(key);
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("DEL", duration, true);
    const profile = getCurrentRequestProfile();
    if (profile) {
      profile.redisQueryNs += (Date.now() - start) * 1e6;
    }
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("DEL", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("DEL", errorType);
    console.error("Redis DEL error:", error);
  }
};

export const clearCache = async (pattern: string): Promise<void> => {
  const start = Date.now();
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("CLEAR", duration, true);
    const profile = getCurrentRequestProfile();
    if (profile) {
      profile.redisQueryNs += (Date.now() - start) * 1e6;
    }
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("CLEAR", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("CLEAR", errorType);
    console.error("Redis CLEAR error:", error);
  }
};

// ===== BATCH OPERATIONS WITH PIPELINING =====
export const batchSet = async (entries: Array<{ key: string; value: string; ttl?: number }>) => {
  const start = Date.now();
  try {
    const pipeline = client.multi();
    for (const { key, value, ttl } of entries) {
      if (ttl) {
        pipeline.setEx(key, ttl, value);
      } else {
        pipeline.set(key, value);
      }
    }
    await pipeline.exec();
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("BATCH_SET", duration, true);
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("BATCH_SET", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("BATCH_SET", errorType);
    console.error("Redis batch SET error:", error);
  }
};

export const batchGet = async (keys: string[]): Promise<(string | null)[]> => {
  const start = Date.now();
  try {
    const pipeline = client.multi();
    for (const key of keys) {
      pipeline.get(key);
    }
    const results = await pipeline.exec();
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("BATCH_GET", duration, true);
    return results as (string | null)[];
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("BATCH_GET", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("BATCH_GET", errorType);
    console.error("Redis batch GET error:", error);
    return keys.map(() => null);
  }
};

export const batchDelete = async (keys: string[]): Promise<void> => {
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
  } catch (error) {
    const duration = (Date.now() - start) / 1000;
    trackRedisOperation("BATCH_DEL", duration, false);
    const errorType = error instanceof Error ? error.constructor.name : "unknown";
    trackRedisOperationError("BATCH_DEL", errorType);
    console.error("Redis batch DELETE error:", error);
  }
};

// ===== CACHE KEYS AND TTL =====
export const CACHE_KEYS = {
  // AI endpoints
  CHURN_PREDICTION: (customerId: string) => `ai:churn:${customerId}`,
  TOP_MENU: (branchId: string, limit: number) => `ai:menu:top:${branchId}:${limit}`,
  DEMAND_FORECAST: (branchId: string, hours: number) => `ai:demand:${branchId}:${hours}`,
  BEHAVIOR_ANALYTICS: (customerId: string) => `ai:behavior:${customerId}`,
  PRICE_OPTIMIZATION: (branchId: string) => `ai:pricing:${branchId}`,

  // Dashboard metrics
  DASHBOARD_METRICS: (branchId: string) => `dashboard:${branchId}`,
  ORDER_STATS: (branchId: string, period: string) => `dashboard:orders:${branchId}:${period}`,
  REVENUE_STATS: (branchId: string, period: string) => `dashboard:revenue:${branchId}:${period}`,
  CUSTOMER_STATS: (branchId: string, period: string) => `dashboard:customers:${branchId}:${period}`,

  // Menu data
  MENU_ITEMS: (branchId: string) => `menu:items:${branchId}`,
  MENU_CATEGORIES: (branchId: string) => `menu:categories:${branchId}`,

  // Branch demand
  BRANCH_DEMAND: (branchId: string) => `demand:${branchId}`,
  BRANCH_DEMAND_HOUR: (branchId: string, hour: number) => `demand:${branchId}:${hour}`,
};

export const CACHE_TTL = {
  AI_PREDICTION: 30,           // 30 seconds
  DASHBOARD_METRICS: 5,        // 5 seconds
  MENU_DATA: 60,               // 60 seconds (1 minute)
  BRANCH_DEMAND: 30,           // 30 seconds
  BEHAVIOR_DATA: 60,           // 60 seconds
  ORDER_STATS: 10,             // 10 seconds
};

// ===== CACHE HELPERS =====
export const cacheChurnPrediction = async (
  customerId: string,
  score: number,
  totalOrders: number,
  totalSpend: number,
  lastOrderDate: Date | null,
  ttl = CACHE_TTL.AI_PREDICTION
) => {
  const key = CACHE_KEYS.CHURN_PREDICTION(customerId);
  await setCache(
    key,
    JSON.stringify({ score, totalOrders, totalSpend, lastOrderDate, timestamp: Date.now() }),
    ttl
  );
};

export const getChurnPrediction = async (customerId: string) => {
  const key = CACHE_KEYS.CHURN_PREDICTION(customerId);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export const cacheDashboardMetrics = async (branchId: string, metrics: any, ttl = CACHE_TTL.DASHBOARD_METRICS) => {
  const key = CACHE_KEYS.DASHBOARD_METRICS(branchId);
  await setCache(key, JSON.stringify(metrics), ttl);
};

export const getDashboardMetrics = async (branchId: string) => {
  const key = CACHE_KEYS.DASHBOARD_METRICS(branchId);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export const cacheMenuItems = async (branchId: string, items: any, ttl = CACHE_TTL.MENU_DATA) => {
  const key = CACHE_KEYS.MENU_ITEMS(branchId);
  await setCache(key, JSON.stringify(items), ttl);
};

export const getMenuItems = async (branchId: string) => {
  const key = CACHE_KEYS.MENU_ITEMS(branchId);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export const cacheTopMenuItems = async (branchId: string, limit: number, items: any, ttl = CACHE_TTL.AI_PREDICTION) => {
  const key = CACHE_KEYS.TOP_MENU(branchId, limit);
  await setCache(key, JSON.stringify(items), ttl);
};

export const getTopMenuItems = async (branchId: string, limit: number) => {
  const key = CACHE_KEYS.TOP_MENU(branchId, limit);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export const cacheBranchDemandForecast = async (branchId: string, hours: number, forecast: any, ttl = CACHE_TTL.AI_PREDICTION) => {
  const key = CACHE_KEYS.DEMAND_FORECAST(branchId, hours);
  await setCache(key, JSON.stringify(forecast), ttl);
};

export const getBranchDemandForecast = async (branchId: string, hours: number) => {
  const key = CACHE_KEYS.DEMAND_FORECAST(branchId, hours);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export const cacheBranchDemand = async (branchId: string, demand: any, ttl = CACHE_TTL.BRANCH_DEMAND) => {
  const key = CACHE_KEYS.BRANCH_DEMAND(branchId);
  await setCache(key, JSON.stringify(demand), ttl);
};

export const getBranchDemand = async (branchId: string) => {
  const key = CACHE_KEYS.BRANCH_DEMAND(branchId);
  const data = await getCache(key);
  return data ? JSON.parse(data) : null;
};

export { client as redisClient };