"use client";

import { io, type Socket } from "socket.io-client";
import { getPublicSocketUrl } from "./config.js";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getPublicSocketUrl(), {
      transports: ["websocket", "polling"],
      autoConnect: true
    });
  }
  return socket;
}
