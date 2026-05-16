import { getAdminNamespace } from "./index.js";
import { batchSet, batchGet } from "../lib/redis.js";
import { trackSocketBroadcast } from "../metrics/metrics.js";

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
  // AI UPDATE EVENT
  // -----------------------------------------------------
  static async emitAIUpdate(branchId: string, data: any) {
    const start = Date.now();
    
    // Check cache to avoid redundant broadcast
    if (!(await shouldEmitEvent("ai_update", branchId, data))) {
      return; // Skip if data unchanged
    }

    const eventData = {
      success: true,
      event: "admin:ai_update",
      data,
      timestamp: Date.now()
    };

    getAdminNamespace().to(`branch_${branchId}`).emit("admin:ai_update", eventData);
    
    // Cache for deduplication
    await cacheEventData("ai_update", branchId, data);
    
    const duration = (Date.now() - start) / 1000;
    trackSocketBroadcast("admin:ai_update", "admin", duration);
  }

  // -----------------------------------------------------
  // CHURN UPDATE EVENT
  // -----------------------------------------------------
  static async emitChurnUpdate(branchId: string, data: any) {
    const start = Date.now();
    
    if (!(await shouldEmitEvent("churn_update", branchId, data))) {
      return;
    }

    const eventData = {
      success: true,
      event: "admin:churn_update",
      data,
      timestamp: Date.now()
    };

    getAdminNamespace().to(`branch_${branchId}`).emit("admin:churn_update", eventData);
    
    await cacheEventData("churn_update", branchId, data);
    
    const duration = (Date.now() - start) / 1000;
    trackSocketBroadcast("admin:churn_update", "admin", duration);
  }

  // -----------------------------------------------------
  // DEMAND UPDATE EVENT
  // -----------------------------------------------------
  static async emitDemandUpdate(branchId: string, data: any) {
    const start = Date.now();
    
    if (!(await shouldEmitEvent("demand_update", branchId, data))) {
      return;
    }

    const eventData = {
      success: true,
      event: "admin:demand_update",
      data,
      timestamp: Date.now()
    };

    getAdminNamespace().to(`branch_${branchId}`).emit("admin:demand_update", eventData);
    
    await cacheEventData("demand_update", branchId, data);
    
    const duration = (Date.now() - start) / 1000;
    trackSocketBroadcast("admin:demand_update", "admin", duration);
  }

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

  // -----------------------------------------------------
  // TRIGGER AI UPDATE AFTER ORDER CREATED
  // -----------------------------------------------------
  static async triggerAIUpdateAfterOrder(order: any) {
    try {
      const { AdminDashboardService } = await import("../services/admin/adminDashboard.service.js");
      const aiSummary = await AdminDashboardService.getAIDashboardSummary(order.branchId);
      
      await this.emitAIUpdate(order.branchId, aiSummary);
    } catch (error) {
      console.error("Failed to trigger AI update after order:", error);
    }
  }

  // -----------------------------------------------------
  // TRIGGER CHURN UPDATE AFTER ORDER DELIVERED
  // -----------------------------------------------------
  static async triggerChurnUpdate(order: any) {
    try {
      const { AdminDashboardService } = await import("../services/admin/adminDashboard.service.js");
      const churnRisk = await AdminDashboardService.getChurnRiskDistribution(order.branchId);
      
      await this.emitChurnUpdate(order.branchId, churnRisk);
    } catch (error) {
      console.error("Failed to trigger churn update:", error);
    }
  }

  // -----------------------------------------------------
  // TRIGGER DEMAND UPDATE AFTER ORDER CREATED
  // -----------------------------------------------------
  static async triggerDemandUpdate(order: any) {
    try {
      const { AdminDashboardService } = await import("../services/admin/adminDashboard.service.js");
      const demandForecast = await AdminDashboardService.getPredictedDemand(order.branchId);
      
      await this.emitDemandUpdate(order.branchId, demandForecast);
    } catch (error) {
      console.error("Failed to trigger demand update:", error);
    }
  }

  // -----------------------------------------------------
  // TRIGGER COURIER PERFORMANCE UPDATE AFTER DELIVERY
  // -----------------------------------------------------
  static async triggerCourierPerformanceUpdate(order: any) {
    try {
      const { AdminDashboardService } = await import("../services/admin/adminDashboard.service.js");
      const topCouriers = await AdminDashboardService.getTopPerformingCouriers(order.branchId, 5);
      
      await this.emitCourierPerformanceUpdate(order.branchId, topCouriers);
    } catch (error) {
      console.error("Failed to trigger courier performance update:", error);
    }
  }
}