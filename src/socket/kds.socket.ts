import { Server, Socket } from "socket.io";
import { OrderService } from "../services/order/order.service.ts";
import { batchSet, batchGet } from "../lib/redis.ts";
import { trackSocketEmit } from "../metrics/metrics.ts";
import logger from "../logger.ts";

// ===== PHASE 8: SOCKET-LEVEL CACHING =====
const CACHE_TTL = 1; // 1 second for KDS updates
const getCacheKey = (event: string, branchId: string) => `socket:kds:${event}:${branchId}`;

/**
 * Check if KDS event data has changed
 */
async function shouldEmitKDSEvent(event: string, branchId: string, data: any): Promise<boolean> {
  const cacheKey = getCacheKey(event, branchId);
  const cached = await batchGet([cacheKey]);
  
  if (cached[0]) {
    const cachedData = JSON.parse(cached[0]);
    if (JSON.stringify(cachedData) === JSON.stringify(data)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Cache KDS event data
 */
async function cacheKDSEventData(event: string, branchId: string, data: any): Promise<void> {
  const cacheKey = getCacheKey(event, branchId);
  await batchSet([{ key: cacheKey, value: JSON.stringify(data), ttl: CACHE_TTL }]);
}

export function registerKDSEvents(_io: Server, socket: Socket) {
  void _io;
  const branchId = socket.data?.branchId;
  
    socket.on("kds:join", (data: { branchId: string }) => {
    socket.data.branchId = data.branchId;
    socket.join(`kds_branch_${data.branchId}`);
    logger.info({ branchId: data.branchId }, "KDS joined branch");
  });

  socket.on("kds:accept_order", async (data: { orderId: string }) => {
    const start = Date.now();
    
    try {
      await OrderService.updateStatus(data.orderId, "accepted");
      
      socket.emit("kds:order_accepted", {
        success: true,
        event: "kds:order_accepted",
        data: { orderId: data.orderId, status: "accepted", timestamp: Date.now() }
      });

      const duration = (Date.now() - start) / 1000;
      trackSocketEmit("kds:order_accepted", duration);
    } catch (error) {
      socket.emit("kds:error", {
        success: false,
        event: "kds:error",
        data: { message: (error as Error).message }
      });
    }
  });

  socket.on("kds:start_preparing", async (data: { orderId: string }) => {
    const start = Date.now();
    
    try {
      await OrderService.updateStatus(data.orderId, "preparing");
      
      socket.emit("kds:preparing_started", {
        success: true,
        event: "kds:preparing_started",
        data: { orderId: data.orderId, status: "preparing", timestamp: Date.now() }
      });

      const duration = (Date.now() - start) / 1000;
      trackSocketEmit("kds:preparing_started", duration);
    } catch (error) {
      socket.emit("kds:error", {
        success: false,
        event: "kds:error",
        data: { message: (error as Error).message }
      });
    }
  });

  socket.on("kds:mark_ready", async (data: { orderId: string }) => {
    const start = Date.now();
    
    try {
      await OrderService.updateStatus(data.orderId, "ready_for_pickup");
      
      socket.emit("kds:order_ready", {
        success: true,
        event: "kds:order_ready",
        data: { orderId: data.orderId, status: "ready_for_pickup", timestamp: Date.now() }
      });

      const duration = (Date.now() - start) / 1000;
      trackSocketEmit("kds:order_ready", duration);
    } catch (error) {
      socket.emit("kds:error", {
        success: false,
        event: "kds:error",
        data: { message: (error as Error).message }
      });
    }
  });

  // ===== PHASE 2: THROTTLE KITCHEN UPDATES (300ms) =====
  socket.on("kds:get_active_orders", async (data: { branchId: string }) => {
    const start = Date.now();
    
    try {
      // Check cache first
      if (!(await shouldEmitKDSEvent("active_orders", data.branchId, {}))) {
        return;
      }

      const orders = await OrderService.getActiveOrders();
      const branchOrders = orders.filter(order => order.branchId === data.branchId);
      
      socket.emit("kds:active_orders", {
        success: true,
        event: "kds:active_orders",
        data: { orders: branchOrders, timestamp: Date.now() }
      });

      // Cache the orders
      await cacheKDSEventData("active_orders", data.branchId, branchOrders);

      const duration = (Date.now() - start) / 1000;
      trackSocketEmit("kds:active_orders", duration);
    } catch (error) {
      socket.emit("kds:error", {
        success: false,
        event: "kds:error",
        data: { message: (error as Error).message }
      });
    }
  });

  socket.on("error", (error) => {
    logger.error({ error, socketId: socket.id }, "KDS Socket error");
  });

  socket.on("disconnect", (reason) => {
    logger.info({ branchId, reason }, "KDS disconnected from branch");
  });
}



