import { Server, Socket } from "socket.io";
import logger from "../logger.ts";
import { registerDriverEvents } from "./driverEvents.ts";
import { registerTerminalEvents } from "./terminalEvents.ts";
import { registerAdminEvents } from "./adminEvents.ts";
import { registerKDSEvents } from "./kdsEvents.ts";

export function registerEvents(io: Server) {
  registerAdminEvents(io);

  io.on("connection", (socket: Socket) => {
    registerDriverEvents(io, socket);
    registerTerminalEvents(io, socket);
    registerKDSEvents(io, socket);

    socket.on("kds_join", ({ branchId }) => {
      socket.join(`branch_${branchId}`);
      logger.info({ branchId }, "KDS joined branch");
    });
  });
}





