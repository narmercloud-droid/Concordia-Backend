import { Server } from "socket.io";
import { Request } from "express";

// ------------------------------------------------------
// Global Socket.IO Declaration (ESM compatible)
// ------------------------------------------------------
declare global {
  var io: Server;
}

// ------------------------------------------------------
// AuthenticatedRequest Type
// ------------------------------------------------------
export type AuthenticatedRequest = Request;

export {};
