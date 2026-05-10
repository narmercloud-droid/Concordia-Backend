import { Server, Socket } from "socket.io";
import { registerDriverEvents } from "./driverEvents";
import { registerTerminalEvents } from "./terminalEvents";
import { registerAdminEvents } from "./adminEvents";
import { registerKDSEvents } from "./kdsEvents";

export function registerEvents(io: Server) {
  registerAdminEvents(io);

  io.on("connection", (socket: Socket) => {
    registerDriverEvents(io, socket);
    registerTerminalEvents(io, socket);
    registerKDSEvents(io, socket);
  });
}
