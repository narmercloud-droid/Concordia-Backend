import { Server } from "socket.io";
import logger from "../logger.ts";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("join_terminal_branch", (branchId) => {
      socket.join(`terminal_${branchId}`);
    });

    socket.on("join_customer_tracking", (trackingToken) => {
      socket.join(`customer_${trackingToken}`);
    });

    socket.on("join_courier_order", (courierToken) => {
      socket.join(`courier_${courierToken}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
