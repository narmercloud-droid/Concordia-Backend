import { Server } from 'socket.io';

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    socket.on('join:order', orderId => {
      socket.join(`order:${orderId}`);
    });

    socket.on('join:branch', branchId => {
      socket.join(`branch:${branchId}:orders`);
    });

    socket.on('join:driver', driverId => {
      socket.join(`driver:${driverId}:orders`);
    });

    // Legacy underscore-room handlers removed — modern room names only

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
