import { Server, Socket } from "socket.io";
import { prisma } from "../prisma/client";
import { KDSService } from "../services/kds/kds.service";
import { getIO } from "../lib/socket";

export function registerKDSEvents(io: Server, socket: Socket) {
  socket.on("kds_connected", async () => {
    const kdsToken = socket.handshake.auth?.kds_token;

    if (!kdsToken) {
      console.log("KDS socket connection failed: no kds_token");
      socket.disconnect();
      return;
    }

    try {
      const kds = await KDSService.loginKDS(kdsToken);
      socket.data.kds_id = kds.id;
      socket.data.branch_id = kds.branch_id;
      socket.join(`kds_${kds.branch_id}`);
      console.log(`KDS socket connection: ${kds.name} (ID: ${kds.id})`);

      // Emit to admin dashboard
      const { getIO } = await import("../lib/socket");
      getIO().to("admin_dashboard").emit("kds_online", {
        kds_id: kds.id,
        branch_id: kds.branch_id,
        name: kds.name,
        is_online: true,
        last_seen: new Date(),
      });
    } catch (err: any) {
      console.log(`KDS socket connection failed: ${err.message}`);
      socket.disconnect();
    }
  });

  socket.on("disconnect", async () => {
    try {
      if (socket.data.kds_id) {
        await prisma.kitchenDisplay.update({
          where: { id: socket.data.kds_id },
          data: {
            is_online: false,
            last_seen: new Date(),
          },
        });
        console.log(`KDS ${socket.data.kds_id} marked offline on disconnect`);

        // Emit to admin dashboard
        const { getIO } = await import("../lib/socket");
        getIO().to("admin_dashboard").emit("kds_offline", {
          kds_id: socket.data.kds_id,
          is_online: false,
          last_seen: new Date(),
        });
      }
    } catch (err: any) {
      console.error(`Error updating KDS offline status: ${err.message}`);
    }
  });
}

export function emitOrderCreated(order: any) {
  getIO().to(`kds_${order.branch_id}`).emit("order_created", order);
}

export function emitOrderUpdated(order: any) {
  getIO().to(`kds_${order.branch_id}`).emit("order_updated", order);
  if (order.terminal_id) {
    getIO().to(`terminal_${order.terminal_id}`).emit("order_updated", order);
  }
  getIO().to("admin_dashboard").emit("order_updated", order);
}

export function emitOrderReady(order: any) {
  getIO().to(`kds_${order.branch_id}`).emit("order_ready", order);
  if (order.terminal_id) {
    getIO().to(`terminal_${order.terminal_id}`).emit("order_ready", order);
  }
  getIO().to("admin_dashboard").emit("order_ready", order);
}

export function emitOrderCompleted(order: any) {
  getIO().to(`kds_${order.branch_id}`).emit("order_completed", order);
  if (order.terminal_id) {
    getIO().to(`terminal_${order.terminal_id}`).emit("order_completed", order);
  }
  getIO().to("admin_dashboard").emit("order_completed", order);
}