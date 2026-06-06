import { PrismaClient } from '@prisma/client';
import { getIO } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';
import { sendPushNotification } from '../notifications/push.service.js';
import { getDynamicPrepTime } from '../kitchen/kitchenLoad.service.js';

const prisma = new PrismaClient();

// Simple moving average for kitchen prep time
export async function estimatePrepTime(branchId) {
  const { dynamicTime } = await getDynamicPrepTime(branchId);
  return dynamicTime;
}

// Estimate driver travel time using last known driver location
export async function estimateDriverTime(order) {
  if (!order.driverId) return 0;

  // try driver table lat/lng
  let loc = null;
  try {
    const driver = await prisma.driver.findUnique({ where: { id: order.driverId } });
    if (driver && driver.lat != null && driver.lng != null) {
      loc = { lat: driver.lat, lng: driver.lng };
    }
  } catch (e) {
    // driver model may not have lat/lng
  }

  // fallback to courierLocation table if available
  if (!loc) {
    try {
      const dloc = await prisma.courierLocation.findFirst({
        where: { courierId: order.driverId },
        orderBy: { createdAt: 'desc' }
      });
      if (dloc) loc = { lat: dloc.latitude, lng: dloc.longitude };
    } catch (e) {
      // ignore if model doesn't exist
    }
  }

  if (!loc) return 0;

  const R = 6371;
  const dLat = (order.customerLat - loc.lat) * Math.PI / 180;
  const dLon = (order.customerLng - loc.lng) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(loc.lat * Math.PI/180) *
    Math.cos(order.customerLat * Math.PI/180) *
    Math.sin(dLon/2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = R * c;

  const avgSpeedKmh = 30; // configurable
  const minutes = (distanceKm / avgSpeedKmh) * 60;

  return Math.round(minutes);
}

export async function computeOrderETA(orderId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  const prep = await estimatePrepTime(order.branchId);
  const driver = await estimateDriverTime(order);

  const total = prep + driver;

  const now = new Date();

  const etaReadyAt = new Date(now.getTime() + prep * 60000);
  const etaDeliveredAt = new Date(now.getTime() + total * 60000);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      estimatedPrepTime: prep,
      estimatedDriverTime: driver,
      estimatedTotalTime: total,
      etaReadyAt,
      etaDeliveredAt
    }
  });

  // Broadcast via WebSocket
  try {
    const io = getIO();
    io.emit(WS_EVENTS.ETA_UPDATED, {
      orderId,
      prep,
      driver,
      total,
      etaReadyAt,
      etaDeliveredAt
    });
  } catch (e) {
    // ignore if WS not initialized
  }

  // Send push notification if customer token exists
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order?.customerPushToken) {
      await sendPushNotification(
        order.customerPushToken,
        'Updated Delivery ETA',
        `Your order will arrive around ${etaDeliveredAt.toLocaleTimeString()}`,
        { orderId }
      );
    }
  } catch (e) {
    console.error('Push notify error:', e.message);
  }

  return { prep, driver, total, etaReadyAt, etaDeliveredAt };
}
