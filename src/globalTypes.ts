import { Server } from "socket.io";
import { Request } from "express";

// ------------------------------------------------------
// Global Socket.IO Declaration (ESM compatible)
// ------------------------------------------------------
declare global {
  var io: Server;
}

// ------------------------------------------------------
// Express Request Augmentation
// ------------------------------------------------------
declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
      branchId: string;
    };
    app?: any;
  }
}

// ------------------------------------------------------
// AuthenticatedRequest Type
// ------------------------------------------------------
export type AuthenticatedRequest = Request;

export {};
