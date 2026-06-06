import { PrismaClient } from '@prisma/client';
import { scoreDriver } from './driverScoring.service.js';
import { getIO } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';
import { sendWS, sendPush } from '../notifications/notification.service.js';
import { NOTIFY } from '../../ws/notificationEvents.js';

const prisma = new PrismaClient();

export async function autoAssignDriver(orderId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  const drivers = await prisma.driver.findMany({
    where: { isAvailable: true }
  });

  if (!drivers.length) return null;

  const scored = [];

  for (const d of drivers) {
    const s = await scoreDriver(d, order);
    if (s) scored.push(s);
  }

  if (!scored.length) return null;

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      driverId: best.driver.id,
      autoAssigned: true,
      assignmentScore: best.score,
      assignedAt: new Date()
    }
  });

  try {
    const io = getIO();
    io.emit(WS_EVENTS.ORDER_STATUS, {
      orderId,
      driverId: best.driver.id,
      autoAssigned: true
    });

    // Notify via higher-level notification events
    sendWS(NOTIFY.DRIVER_ASSIGNED, { orderId, driverId: best.driver.id });

    // Push to driver if subscription exists
    if (best.driver.pushSubscription) {
      await sendPush(best.driver.pushSubscription, 'New Delivery', 'A new order has been assigned to you', { orderId });
    }
  } catch (e) {}

  return updated;
}
