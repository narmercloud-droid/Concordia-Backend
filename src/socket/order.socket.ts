import { getIO } from "../lib/socket.ts";

export class OrderSocket {
  // -----------------------------------------------------
  // ORDER CREATED
  // -----------------------------------------------------
  static orderCreated(order: any) {
    getIO().to(`branch_${order.branch_id}`).emit("order_created", order);
  }

  // -----------------------------------------------------
  // ORDER UPDATED (status changes, courier pickup, etc.)
  // -----------------------------------------------------
  static orderUpdated(order: any) {
    getIO().emit("order_updated", order);
  }

  // -----------------------------------------------------
  // ORDER ASSIGNED TO TERMINAL
  // -----------------------------------------------------
  static orderAssigned(order: any) {
    if (order.terminal_id) {
      getIO().to(`terminal_${order.terminal_id}`).emit("order_assigned", order);
    }
    getIO().to(`branch_${order.branch_id}`).emit("order_assigned", order);
  }

  // -----------------------------------------------------
  // ORDER ACCEPTED BY TERMINAL
  // -----------------------------------------------------
  static orderAccepted(order: any) {
    if (order.terminal_id) {
      getIO().to(`terminal_${order.terminal_id}`).emit("order_accepted", order);
    }
    getIO().to(`branch_${order.branch_id}`).emit("order_accepted", order);
  }

  // -----------------------------------------------------
  // ORDER REJECTED BY TERMINAL
  // -----------------------------------------------------
  static orderRejected(order: any, terminal_id?: number) {
    if (terminal_id) {
      getIO().to(`terminal_${terminal_id}`).emit("order_rejected", order);
    }
    getIO().to(`branch_${order.branch_id}`).emit("order_rejected", order);
  }
}





