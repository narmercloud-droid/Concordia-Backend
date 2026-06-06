import { PrismaClient } from '@prisma/client';
import { emitOrderUpdate, emitBranchUpdate, emitAndNotifyCustomer, emitManagerUpdate } from '../../realtime/emitters.js';

const prisma = new PrismaClient();

export async function driverAccept(req, res) {
  const { driverId, orderId } = req.body;

  await prisma.driver.update({
    where: { id: driverId },
    data: { currentOrderId: orderId }
  });

  emitOrderUpdate(orderId, {
    type: 'driver-accepted',
    driverId
  });

  emitAndNotifyCustomer(orderId, {
    type: 'driver-assigned',
    driverId
  });

  // notify managers
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      emitManagerUpdate(order.branchId, {
        type: 'driver-accepted',
        driverId,
        orderId
      });
    }
  } catch (e) {
    console.error('Manager emit error:', e.message);
  }

  res.json({ success: true });
}

export async function driverDecline(req, res) {
  const { driverId, orderId } = req.body;

  await prisma.driver.update({
    where: { id: driverId },
    data: { isAvailable: true, currentOrderId: null }
  });

  emitOrderUpdate(orderId, {
    type: 'driver-declined',
    driverId
  });

  emitAndNotifyCustomer(orderId, {
    type: 'driver-declined',
    driverId
  });

  emitBranchUpdate(req.body.branchId, {
    type: 'driver-declined',
    orderId
  });

  // notify managers
  try {
    emitManagerUpdate(req.body.branchId, {
      type: 'driver-declined',
      driverId,
      orderId
    });
  } catch (e) {
    console.error('Manager emit error:', e.message);
  }

  res.json({ success: true });
}
