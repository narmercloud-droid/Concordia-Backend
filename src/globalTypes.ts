import { Server } from "socket.io";
import type { Request } from "express";

// ------------------------------------------------------
// Global Socket.IO Declaration (ESM compatible)
// ------------------------------------------------------
declare global {
  let io: Server;
}

// ------------------------------------------------------
// AuthenticatedRequest Type
// ------------------------------------------------------
export type AuthenticatedRequest = Request;

export {};
