import { Server, Socket } from "socket.io";
import logger from "../logger.ts";

export function registerAdminEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    // Check if this is an admin connection (you might want to add authentication here)
    const isAdmin = socket.handshake.auth?.admin_token || socket.handshake.query?.admin === "true";

    if (isAdmin) {
      socket.join("admin_dashboard");
      logger.info("Admin connected to dashboard");

      socket.on("disconnect", () => {
        logger.info("Admin disconnected from dashboard");
      });
    }
  });
}
