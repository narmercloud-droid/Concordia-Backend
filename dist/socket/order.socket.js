"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSocket = void 0;
const socket_1 = require("../lib/socket");
class OrderSocket {
    // -----------------------------------------------------
    // ORDER CREATED
    // -----------------------------------------------------
    static orderCreated(order) {
        (0, socket_1.getIO)().to(`branch_${order.branch_id}`).emit("order_created", order);
    }
    // -----------------------------------------------------
    // ORDER UPDATED (status changes, courier pickup, etc.)
    // -----------------------------------------------------
    static orderUpdated(order) {
        (0, socket_1.getIO)().emit("order_updated", order);
    }
    // -----------------------------------------------------
    // ORDER ASSIGNED TO TERMINAL
    // -----------------------------------------------------
    static orderAssigned(order) {
        if (order.terminal_id) {
            (0, socket_1.getIO)().to(`terminal_${order.terminal_id}`).emit("order_assigned", order);
        }
        (0, socket_1.getIO)().to(`branch_${order.branch_id}`).emit("order_assigned", order);
    }
    // -----------------------------------------------------
    // ORDER ACCEPTED BY TERMINAL
    // -----------------------------------------------------
    static orderAccepted(order) {
        if (order.terminal_id) {
            (0, socket_1.getIO)().to(`terminal_${order.terminal_id}`).emit("order_accepted", order);
        }
        (0, socket_1.getIO)().to(`branch_${order.branch_id}`).emit("order_accepted", order);
    }
    // -----------------------------------------------------
    // ORDER REJECTED BY TERMINAL
    // -----------------------------------------------------
    static orderRejected(order, terminal_id) {
        if (terminal_id) {
            (0, socket_1.getIO)().to(`terminal_${terminal_id}`).emit("order_rejected", order);
        }
        (0, socket_1.getIO)().to(`branch_${order.branch_id}`).emit("order_rejected", order);
    }
}
exports.OrderSocket = OrderSocket;
