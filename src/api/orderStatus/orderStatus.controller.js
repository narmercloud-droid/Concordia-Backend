import { PrismaClient } from '@prisma/client';
import { computeOrderETA } from '../../services/eta/eta.service.js';
import { updateBranchLoad } from '../../services/kitchen/kitchenLoad.service.js';
import { addPoints } from '../../services/loyalty/loyalty.service.js';
import { getIO } from '../../realtime/socket.js';
import { sendNotification, sendWS, sendPush } from '../../services/notifications/notification.service.js';
import { getIO as getWS } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';
import { NOTIFY } from '../../ws/notificationEvents.js';
import { autoAssignDriver } from '../../services/dispatch/autoDispatch.service.js';

const prisma = new PrismaClient();

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowed = [
      'pending',
      'accepted',
      'confirmed',
      'preparing',
      'ready',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const data = { status };

    if (status === 'confirmed') {
      data.confirmedAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data,
      include: { branch: true, driver: true, customer: true }
    });

    if (['confirmed', 'preparing', 'ready'].includes(status)) {
      if (status === 'confirmed') {
        try {
          await autoAssignDriver(order.id);
        } catch (e) {
          console.error('autoAssignDriver error:', e.message);
        }
      }
      try {
        await updateBranchLoad(order.branchId);
      } catch (e) {}
      try {
        await computeOrderETA(order.id);
      } catch (e) {
        console.error('computeOrderETA error:', e.message);
      }
      
      // Broadcast ORDER_STATUS via new WS helper if available
      try {
        const ws = getWS();
        ws.emit(WS_EVENTS.ORDER_STATUS, {
          orderId: order.id,
          status: order.status,
          kitchenStatus: order.kitchenStatus,
          driverStatus: order.driverId ? 'assigned' : null
        });
      } catch (e) {
        // ignore
      }
    }

    // Award loyalty points when order is delivered
    if (status === 'delivered') {
      try {
        await addPoints(order.customerId, order.orderTotal ?? order.externalAmount ?? 0);
      } catch (e) {
        console.error('addPoints error:', e.message);
      }
    }

      // Send higher-level notifications and push messages
      try {
        if (status === 'confirmed') {
          sendWS(NOTIFY.ORDER_CONFIRMED, { orderId: order.id });
          if (order.customer?.pushSubscription) await sendPush(order.customer.pushSubscription, 'Order Update', 'Your order is now confirmed', { orderId: order.id });
        }

        if (status === 'preparing') {
          sendWS(NOTIFY.ORDER_PREPARING, { orderId: order.id });
          if (order.customer?.pushSubscription) await sendPush(order.customer.pushSubscription, 'Order Update', 'Your order is now preparing', { orderId: order.id });
        }

        if (status === 'ready') {
          sendWS(NOTIFY.ORDER_READY, { orderId: order.id });
          if (order.customer?.pushSubscription) await sendPush(order.customer.pushSubscription, 'Order Update', 'Your order is ready for pickup', { orderId: order.id });
        }

        if (status === 'out_for_delivery') {
          sendWS(NOTIFY.ORDER_OUT_FOR_DELIVERY, { orderId: order.id });
          if (order.customer?.pushSubscription) await sendPush(order.customer.pushSubscription, 'Order Update', 'Your order is out for delivery', { orderId: order.id });
        }

        if (status === 'delivered') {
          sendWS(NOTIFY.ORDER_DELIVERED, { orderId: order.id });
          if (order.customer?.pushSubscription) await sendPush(order.customer.pushSubscription, 'Order Update', 'Your order has been delivered', { orderId: order.id });
        }
      } catch (e) {
        console.error('Notification send error:', e.message);
      }

      await sendNotification('order_accepted', {
        orderId: order.id,
        customerId: order.customerId,
        driverId: order.driverId,
        status: order.status
      });

    const io = getIO();

    io.to(`order:${orderId}`).emit('status:update', status);
    io.to(`branch:${order.branchId}:orders`).emit('order:update', order);

    if (order.driverId) {
      io.to(`driver:${order.driverId}:orders`).emit('order:update', order);
    }

    return res.json({ success: true, order });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
