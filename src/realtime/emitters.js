import { getIO } from './socket.js';

export function emitOrderUpdate(orderId, payload) {
  getIO().to(`order:${orderId}`).emit('order-update', payload);
}

export function emitBranchUpdate(branchId, payload) {
  getIO().to(`branch:${branchId}:orders`).emit('branch-update', payload);
}

export function emitDriverLocation(orderId, payload) {
  getIO().to('order_' + orderId).emit('driver-location', payload);
}

export function emitKitchenUpdate(branchId, payload) {
  getIO().to('kitchen_' + branchId).emit('kitchen-update', payload);
}

export function emitCustomerUpdate(orderId, payload) {
  getIO().to('customer_order_' + orderId).emit('customer-update', payload);
}

export function emitManagerUpdate(branchId, payload) {
  getIO().to('manager_branch_' + branchId).emit('manager-update', payload);
}

import { PrismaClient } from '@prisma/client';
import { notifyCustomer } from '../services/notifications/notification.service.js';

const prisma = new PrismaClient();

export async function emitAndNotifyCustomer(orderId, payload) {
  emitCustomerUpdate(orderId, payload);

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (order) {
    await notifyCustomer(order, payload);
  }
}
