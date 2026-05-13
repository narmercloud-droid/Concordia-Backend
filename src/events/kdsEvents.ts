import { Server, Socket } from "socket.io";
export function registerKDSEvents(io: Server, socket: Socket) {
  socket.on("kds_connected", ({ branchId }) => {
    socket.join(`branch_${branchId}`);
    io.to("admin_dashboard").emit("kds_online", { branchId });
  });

  socket.on("disconnect", () => {
    // Additional logic to handle KDS disconnection if needed
  });
}
