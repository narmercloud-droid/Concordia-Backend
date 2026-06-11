import { getAdminNamespace } from "./index.js";
import { batchSet, batchGet } from "../lib/redis.js";
import { trackSocketBroadcast } from "../metrics/metrics.js";
// ===== PHASE 8: SOCKET-LEVEL CACHING =====
// Cache last event per room to avoid redundant broadcasts
const CACHE_TTL = 2; // 2 seconds
const getCacheKey = (event, branchId) => `socket:cache:${event}:${branchId}`;
/**
 * Check if event data has changed since last emit
 */
async function shouldEmitEvent(event, branchId, data) {
    const cacheKey = getCacheKey(event, branchId);
    const cached = await batchGet([cacheKey]);
    if (cached[0]) {
        const cachedData = JSON.parse(cached[0]);
        // Compare hash of data
        if (JSON.stringify(cachedData) === JSON.stringify(data)) {
            return false; // Data unchanged, skip emit
        }
    }
    return true;
}
/**
 * Cache event data for deduplication
 */
async function cacheEventData(event, branchId, data) {
    const cacheKey = getCacheKey(event, branchId);
    await batchSet([{ key: cacheKey, value: JSON.stringify(data), ttl: CACHE_TTL }]);
}
export class AdminSocket {
    // -----------------------------------------------------
    // COURIER PERFORMANCE UPDATE EVENT
    // -----------------------------------------------------
    static async emitCourierPerformanceUpdate(branchId, data) {
        const start = Date.now();
        if (!(await shouldEmitEvent("courier_perf_update", branchId, data))) {
            return;
        }
        const eventData = {
            success: true,
            event: "admin:courier_performance_update",
            data,
            timestamp: Date.now()
        };
        getAdminNamespace().to(`branch_${branchId}`).emit("admin:courier_performance_update", eventData);
        await cacheEventData("courier_perf_update", branchId, data);
        const duration = (Date.now() - start) / 1000;
        trackSocketBroadcast("admin:courier_performance_update", "admin", duration);
    }
}
