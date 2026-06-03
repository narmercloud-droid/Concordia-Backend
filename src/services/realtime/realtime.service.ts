import { getIO } from "../../websocket/socketServer.ts";

export function broadcastToTerminal(branchId, event, payload) {
  getIO().to(`terminal_${branchId}`).emit(event, payload);
}

export function broadcastToCustomer(trackingToken, event, payload) {
  getIO().to(`customer_${trackingToken}`).emit(event, payload);
}

export function broadcastToCourier(courierToken, event, payload) {
  getIO().to(`courier_${courierToken}`).emit(event, payload);
}

