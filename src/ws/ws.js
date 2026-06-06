import { Server } from 'socket.io';

let io = null;

export function initWebSocket(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error('WebSocket not initialized');
  return io;
}
