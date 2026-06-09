import { getAdminNamespace } from "./index.ts";
import { batchSet, batchGet } from "../lib/redis.ts";
import { trackSocketBroadcast } from "../metrics/metrics.ts";

// ===== PHASE 8: SOCKET-LEVEL CACHING =====
// Cache last event per room to avoid redundant broadcasts
const CACHE_TTL = 2; // 2 seconds
const getCacheKey = (event: string, branchId: string) => `socket:cache:${event}:${branchId}`;

/**
 * Check if event data has changed since last emit
 */
async function shouldEmitEvent(event: string, branchId: string, data: any): Promise<boolean> {
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
async function cacheEventData(event: string, branchId: string, data: any): Promise<void> {
  const cacheKey = getCacheKey(event, branchId);
  await batchSet([{ key: cacheKey, value: JSON.stringify(data), ttl: CACHE_TTL }]);
}

export class AdminSocket {
  // -----------------------------------------------------
  // COURIER PERFORMANCE UPDATE EVENT
  // -----------------------------------------------------
  static async emitCourierPerformanceUpdate(branchId: string, data: any) {
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



