import { PrismaClient } from '@prisma/client';
import { emitOrderUpdate, emitBranchUpdate, emitKitchenUpdate, emitAndNotifyCustomer, emitManagerUpdate } from '../../realtime/emitters.js';
import { computeOrderETA } from '../../services/eta/eta.service.js';
import { updateBranchLoad } from '../../services/kitchen/kitchenLoad.service.js';
import { getIO as getWS } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';

const prisma = new PrismaClient();

export async function updateKitchenStatus(req, res) {
  const { orderId, status } = req.body;

  const data = {
    kitchenStatus: status,
    kitchenUpdatedAt: new Date()
  };

  if (status === 'preparing') {
    data.preparingAt = new Date();
  }

  if (status === 'ready') {
    data.readyAt = new Date();
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data
  });
  try {
    // Recalculate kitchen load and ETA
    try {
      await updateBranchLoad(order.branchId);
    } catch (e) {}
    await computeOrderETA(order.id);
  } catch (e) {
    console.error('computeOrderETA error:', e.message);
  }
  try {
    const ws = getWS();
    ws.emit(WS_EVENTS.ORDER_STATUS, {
      orderId: order.id,
      status: order.status,
      kitchenStatus: order.kitchenStatus,
      driverStatus: order.driverId ? 'assigned' : null
    });
  } catch (e) {}

  emitOrderUpdate(orderId, {
    type: 'kitchen-status',
    status
  });

  emitBranchUpdate(order.branchId, {
    type: 'kitchen-status',
    orderId,
    status
  });

  emitKitchenUpdate(order.branchId, {
    orderId,
    status
  });

  emitAndNotifyCustomer(orderId, {
    type: 'kitchen-status',
    status
  });

  emitManagerUpdate(order.branchId, {
    type: 'kitchen-status',
    orderId,
    status
  });

  res.json({ success: true });
}

export async function getKitchenQueue(req, res) {
  const { branchId } = req.params;

  const orders = await prisma.order.findMany({
    where: {
      branchId,
      status: 'confirmed'
    },
    orderBy: { createdAt: 'asc' }
  });

  res.json({ orders });
}
