let io = null;
export const setIO = (socketIO) => {
    io = socketIO;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
export const getOrdersNamespace = () => {
    const io = getIO();
    return io.of("/orders");
};
export const getCouriersNamespace = () => {
    const io = getIO();
    return io.of("/couriers");
};
export const getKDSNamespace = () => {
    const io = getIO();
    return io.of("/kds");
};
export const getAdminNamespace = () => {
    const io = getIO();
    return io.of("/admin");
};
export const joinCustomerRoom = (customerId, socket) => {
    socket.join(`customer_${customerId}`);
};
export const joinCourierRoom = (courierId, socket) => {
    socket.join(`courier_${courierId}`);
};
export const joinOrderRoom = (orderId, socket) => {
    socket.join(`order_${orderId}`);
};
export const joinAdminRoom = (socket) => {
    socket.join("admin_dashboard");
};
// ============================================
// AI/ML INTELLIGENCE LAYER SOCKET EVENTS
// ============================================
/**
 * Emit AI update event to admin dashboard
 */
export const emitAIUpdate = (branchId, data) => {
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
export const emitChurnUpdate = (branchId, data) => {
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
export const emitDemandUpdate = (branchId, data) => {
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
export const emitCourierPerformanceUpdate = (branchId, data) => {
    const eventData = {
        success: true,
        event: "admin:courier_performance_update",
        data
    };
    getAdminNamespace().to(`branch_${branchId}`).emit("admin:courier_performance_update", eventData);
};
