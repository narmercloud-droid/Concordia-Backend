import { Server } from "socket.io";
import { prisma } from "../prisma/client.ts";
import logger from "../logger.ts";
import { env } from "../config/env.ts";

let io: Server | undefined;

const socketAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
  "ionic://localhost",
  env.FRONTEND_URL,
  env.CORS_ORIGIN
].filter(Boolean) as string[];

function isSocketOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  if (socketAllowedOrigins.includes(origin)) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (hostname.endsWith(".vercel.app")) return true;
    if (hostname === "concordiapizza.de" || hostname.endsWith(".concordiapizza.de")) return true;
    if (hostname === "pizzeriaconcordia.de" || hostname.endsWith(".pizzeriaconcordia.de")) return true;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (protocol === "capacitor:" || protocol === "ionic:") return true;
  } catch {
    return false;
  }
  return false;
}

async function resolveTerminalFromToken(token: unknown) {
  if (!token || typeof token !== "string") return null;
  return prisma.terminal.findUnique({
    where: { activation_token: token }
  });
}

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isSocketOriginAllowed(origin)) {
          callback(null, origin ?? true);
          return;
        }
        callback(new Error("CORS not allowed"), false);
      },
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("join_terminal_branch", async (payload, ack) => {
      try {
        const branchId =
          typeof payload === "string"
            ? payload
            : payload?.branchId != null
              ? String(payload.branchId)
              : "";
        const token =
          (typeof payload === "object" && payload?.token) ||
          socket.handshake.auth?.terminal_token ||
          socket.handshake.headers?.["x-terminal-token"];

        const terminal = await resolveTerminalFromToken(token);
        if (!terminal) {
          logger.warn({ socketId: socket.id }, "join_terminal_branch rejected: missing/invalid token");
          if (typeof ack === "function") ack({ ok: false, error: "Unauthorized" });
          return;
        }

        if (branchId && branchId !== terminal.branchId) {
          logger.warn(
            { socketId: socket.id, branchId, terminalBranchId: terminal.branchId },
            "join_terminal_branch rejected: branch mismatch"
          );
          if (typeof ack === "function") ack({ ok: false, error: "Forbidden" });
          return;
        }

        const roomBranchId = terminal.branchId;
        socket.data.terminal_id = terminal.id;
        socket.data.branch_id = roomBranchId;
        // Dual-join during transition: UI broadcasts use branch rooms; legacy emitters use terminal id
        socket.join(`terminal_${roomBranchId}`);
        socket.join(`terminal_${terminal.id}`);
        socket.join(`branch_${roomBranchId}`);

        await prisma.terminal.update({
          where: { id: terminal.id },
          data: { isOnline: true, lastSeen: new Date() }
        });

        if (typeof ack === "function") ack({ ok: true, branchId: roomBranchId });
      } catch (err) {
        logger.error({ err }, "join_terminal_branch failed");
        if (typeof ack === "function") ack({ ok: false, error: "Internal error" });
      }
    });

    socket.on("join_customer_tracking", (trackingToken) => {
      if (!trackingToken || typeof trackingToken !== "string") return;
      socket.join(`customer_${trackingToken}`);
    });

    socket.on("join_courier_order", (courierToken) => {
      if (!courierToken || typeof courierToken !== "string") return;
      socket.join(`courier_${courierToken}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
