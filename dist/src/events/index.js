import { registerDriverEvents } from "./driverEvents";
import { registerTerminalEvents } from "./terminalEvents";
import { registerAdminEvents } from "./adminEvents";
import { registerKDSEvents } from "./kdsEvents";
export function registerEvents(io) {
    registerAdminEvents(io);
    io.on("connection", (socket) => {
        registerDriverEvents(io, socket);
        registerTerminalEvents(io, socket);
        registerKDSEvents(io, socket);
        socket.on("kds_join", ({ branchId }) => {
            socket.join(`branch_${branchId}`);
            console.log("KDS joined branch:", branchId);
        });
    });
}
