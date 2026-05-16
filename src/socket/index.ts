import { Server, Namespace } from "socket.io";

let io: Server | null = null;

export const setIO = (socketIO: Server) => {
  io = socketIO;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getOrdersNamespace = (): Namespace => {
  const io = getIO();
  return io.of("/orders");
};

export const getCouriersNamespace = (): Namespace => {
  const io = getIO();
  return io.of("/couriers");
};

export const getKDSNamespace = (): Namespace => {
  const io = getIO();
  return io.of("/kds");
};

export const getAdminNamespace = (): Namespace => {
  const io = getIO();
  return io.of("/admin");
};

export const joinCustomerRoom = (customerId: string, socket: any) => {
  socket.join(`customer_${customerId}`);
};

export const joinCourierRoom = (courierId: string, socket: any) => {
  socket.join(`courier_${courierId}`);
};

export const joinOrderRoom = (orderId: string, socket: any) => {
  socket.join(`order_${orderId}`);
};

export const joinAdminRoom = (socket: any) => {
  socket.join("admin_dashboard");
};

// ============================================
// AI/ML INTELLIGENCE LAYER SOCKET EVENTS
// ============================================

/**
 * Emit AI update event to admin dashboard
 */
export const emitAIUpdate = (branchId: string, data: any) => {
  const eventData = {
    success: true,
    event: "admin:ai_update",
    data
  };

  getAdminNamespace().to(`branch_${branchId}`).emit("admin:ai_update", eventData);
};

/**
 * Emit churn update event to admin dashboard
 */
export const emitChurnUpdate = (branchId: string, data: any) => {
  const eventData = {
    success: true,
    event: "admin:churn_update",
    data
  };

  getAdminNamespace().to(`branch_${branchId}`).emit("admin:churn_update", eventData);
};

/**
 * Emit demand update event to admin dashboard
 */
export const emitDemandUpdate = (branchId: string, data: any) => {
  const eventData = {
    success: true,
    event: "admin:demand_update",
    data
  };

  getAdminNamespace().to(`branch_${branchId}`).emit("admin:demand_update", eventData);
};

/**
 * Emit courier performance update event to admin dashboard
 */
export const emitCourierPerformanceUpdate = (branchId: string, data: any) => {
  const eventData = {
    success: true,
    event: "admin:courier_performance_update",
    data
  };

  getAdminNamespace().to(`branch_${branchId}`).emit("admin:courier_performance_update", eventData);
};
