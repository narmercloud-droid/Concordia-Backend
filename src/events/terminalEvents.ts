import { Server, Socket } from "socket.io";
import { prisma } from "../prisma/client";
import { TerminalService } from "../services/terminal/terminal.service";

export function registerTerminalEvents(io: Server, socket: Socket) {
  socket.on("terminal_connected", async () => {
    const terminalToken = socket.handshake.auth?.terminal_token;

    if (!terminalToken) {
      console.log("Terminal socket connection failed: no terminal_token");
      socket.disconnect();
      return;
    }

    try {
      const terminal = await TerminalService.loginTerminal(terminalToken);
      socket.data.terminal_id = terminal.id;
      socket.data.branch_id = terminal.branch_id;
      socket.join(`terminal_${terminal.id}`);
      socket.join(`branch_${terminal.branch_id}`);
      console.log(`Terminal socket connection: ${terminal.name} (ID: ${terminal.id})`);

      // Emit to admin dashboard
      const { getIO } = await import("../lib/socket");
      getIO().to("admin_dashboard").emit("terminal_online", {
        terminal_id: terminal.id,
        is_online: true,
        last_seen: new Date(),
      });
    } catch (err: any) {
      console.log(`Terminal socket connection failed: ${err.message}`);
      socket.disconnect();
    }
  });

  socket.on("printer_status", async (data: any) => {
    try {
      const status = data?.status ?? 'offline'
      const payload = {
        terminal_id: socket.data.terminal_id,
        branch_id: socket.data.branch_id,
        status,
        queue_length: data?.queue_length ?? 0,
        timestamp: data?.timestamp ? new Date(data.timestamp) : new Date(),
      }
      io.to("admin_dashboard").emit("printer_status_update", payload)
    } catch (err: any) {
      console.error(`Error forwarding printer status: ${err.message}`)
    }
  });

  socket.on("disconnect", async () => {
    try {
      if (socket.data.terminal_id) {
        await prisma.branchTerminal.update({
          where: { id: socket.data.terminal_id },
          data: {
            is_online: false,
            last_seen: new Date(),
          },
        });
        console.log(`Terminal ${socket.data.terminal_id} marked offline on disconnect`);

        // Emit to admin dashboard
        io.to("admin_dashboard").emit("terminal_offline", {
          terminal_id: socket.data.terminal_id,
          is_online: false,
          last_seen: new Date(),
        });
      }
    } catch (err: any) {
      console.error(`Error updating terminal offline status: ${err.message}`);
    }
  });
}

export function emitOrderAssigned(io: Server, order: any) {
  if (order.terminal_id) io.to(`terminal_${order.terminal_id}`).emit("order_assigned", order);
  io.to(`branch_${order.branch_id}`).emit("order_assigned", order);
}

export function emitOrderAccepted(io: Server, order: any) {
  if (order.terminal_id) io.to(`terminal_${order.terminal_id}`).emit("order_accepted", order);
  io.to(`branch_${order.branch_id}`).emit("order_accepted", order);
  if (order.tracking_token) io.to(`customer_${order.tracking_token}`).emit("order_accepted", order);
}

export function emitOrderPreparing(io: Server, order: any) {
  if (order.terminal_id) io.to(`terminal_${order.terminal_id}`).emit("order_preparing", order);
  io.to(`branch_${order.branch_id}`).emit("order_preparing", order);
  if (order.tracking_token) io.to(`customer_${order.tracking_token}`).emit("order_preparing", order);
}

export function emitOrderReady(io: Server, order: any) {
  if (order.terminal_id) io.to(`terminal_${order.terminal_id}`).emit("order_ready", order);
  io.to(`branch_${order.branch_id}`).emit("order_ready", order);
  if (order.tracking_token) io.to(`customer_${order.tracking_token}`).emit("order_ready", order);
}

export function emitOrderCompleted(io: Server, order: any) {
  if (order.terminal_id) io.to(`terminal_${order.terminal_id}`).emit("order_completed", order);
  io.to(`branch_${order.branch_id}`).emit("order_completed", order);
  if (order.tracking_token) io.to(`customer_${order.tracking_token}`).emit("order_completed", order);
}

export function emitOrderRejected(io: Server, order: any, terminal_id: number) {
  if (terminal_id) io.to(`terminal_${terminal_id}`).emit("order_rejected", order);
  io.to(`branch_${order.branch_id}`).emit("order_rejected", order);
  if (order.tracking_token) io.to(`customer_${order.tracking_token}`).emit("order_rejected", order);
}
export async function emitTerminalStatusUpdate(io: Server, terminal_id: number, is_online: boolean, last_seen: Date) {
  io.to("admin_dashboard").emit("terminal_status_update", {
    terminal_id,
    is_online,
    last_seen,
  });
}

