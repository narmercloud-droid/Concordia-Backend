import { Server, Socket } from "socket.io";
import { registerDriverEvents } from "./driverEvents.js";
import { registerTerminalEvents } from "./terminalEvents.js";
import { registerAdminEvents } from "./adminEvents.js";
import { registerKDSEvents } from "./kdsEvents.js";

export function registerEvents(io: Server) {
  registerAdminEvents(io);

  io.on("connection", (socket: Socket) => {
    registerDriverEvents(io, socket);
    registerTerminalEvents(io, socket);
    registerKDSEvents(io, socket);

    socket.on("kds_join", ({ branchId }) => {
      socket.join(`branch_${branchId}`);
      console.log("KDS joined branch:", branchId);
    });
  });
}

