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
declare module "express-serve-static-core" {
  interface User {
    id: string;
    role: string;
    branchId: string;
  }

  interface Request {
    user?: User;
  }
}

// ------------------------------------------------------
// AuthenticatedRequest Type
// ------------------------------------------------------
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    branchId: string;
  };
}

export {};
