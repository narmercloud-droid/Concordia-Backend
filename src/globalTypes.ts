import { Server } from "socket.io";
import type { Request } from "express";

// ------------------------------------------------------
// Global Socket.IO Declaration (ESM compatible)
// ------------------------------------------------------
declare global {
  var io: Server;
}

// ------------------------------------------------------
// AuthenticatedRequest Type
// Augments Express Request with the authenticated user context.
// ------------------------------------------------------
export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: string;
    branchId?: string;
  };
  app?: any;
};

export {};
