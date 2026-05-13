import { getIO } from "../lib/socket.js";
export class OrderSocket {
    // -----------------------------------------------------
    // ORDER CREATED
    // -----------------------------------------------------
    static orderCreated(order) {
        getIO().to(`branch_${order.branch_id}`).emit("order_created", order);
    }
    // -----------------------------------------------------
    // ORDER UPDATED (status changes, courier pickup, etc.)
    // -----------------------------------------------------
    static orderUpdated(order) {
        getIO().emit("order_updated", order);
    }
    // -----------------------------------------------------
    // ORDER ASSIGNED TO TERMINAL
    // -----------------------------------------------------
    static orderAssigned(order) {
        if (order.terminal_id) {
            getIO().to(`terminal_${order.terminal_id}`).emit("order_assigned", order);
        }
        getIO().to(`branch_${order.branch_id}`).emit("order_assigned", order);
    }
    // -----------------------------------------------------
    // ORDER ACCEPTED BY TERMINAL
    // -----------------------------------------------------
    static orderAccepted(order) {
        if (order.terminal_id) {
            getIO().to(`terminal_${order.terminal_id}`).emit("order_accepted", order);
        }
        getIO().to(`branch_${order.branch_id}`).emit("order_accepted", order);
    }
    // -----------------------------------------------------
    // ORDER REJECTED BY TERMINAL
    // -----------------------------------------------------
    static orderRejected(order, terminal_id) {
        if (terminal_id) {
            getIO().to(`terminal_${terminal_id}`).emit("order_rejected", order);
        }
        getIO().to(`branch_${order.branch_id}`).emit("order_rejected", order);
    }
}
