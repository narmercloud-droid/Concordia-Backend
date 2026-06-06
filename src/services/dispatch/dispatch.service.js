import { PrismaClient } from '@prisma/client';
import { emitBranchUpdate, emitOrderUpdate, emitManagerUpdate } from '../../realtime/emitters.js';

const prisma = new PrismaClient();

export async function autoAssignDriver(order) {
  const drivers = await prisma.driver.findMany({
    where: {
      branchId: order.branchId,
      isAvailable: true
    }
  });

  if (drivers.length === 0) {
    emitBranchUpdate(order.branchId, {
      type: 'no-driver-available',
      orderId: order.id
    });
    return null;
  }

  const driver = drivers[0];

  await prisma.driver.update({
    where: { id: driver.id },
    data: { currentOrderId: order.id, isAvailable: false }
  });

  emitOrderUpdate(order.id, {
    type: 'driver-assigned',
    driverId: driver.id
  });

  emitBranchUpdate(order.branchId, {
    type: 'driver-assigned',
    orderId: order.id,
    driverId: driver.id
  });

  emitManagerUpdate(order.branchId, {
    type: 'driver-assigned',
    orderId: order.id,
    driverId: driver.id
  });

  return driver;
}
