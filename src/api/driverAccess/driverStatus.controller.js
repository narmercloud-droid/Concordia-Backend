import { PrismaClient } from '@prisma/client';
import { emitOrderUpdate, emitBranchUpdate, emitManagerUpdate, emitAndNotifyCustomer } from '../../realtime/emitters.js';
import { computeOrderETA } from '../../services/eta/eta.service.js';
import { getIO as getWS } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';
import { updateDriverDeliveryStats, recordDriverCancellation } from '../../services/drivers/performance.service.js';

const prisma = new PrismaClient();

export async function updateDriverStatus(req, res) {
  const { orderId, status } = req.body;

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const updateData = {};

  if (status === 'picked-up') {
    updateData.pickedUpAt = new Date();
  }

  if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  let wasCancelledByDriver = false;

  if (Object.keys(updateData).length) {
    try {
      const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: updateData });
      try {
        await computeOrderETA(orderId);
        try {
          const ws = getWS();
          ws.emit(WS_EVENTS.ORDER_STATUS, {
            orderId,
            status: 'picked-up',
            kitchenStatus: null,
            driverStatus: 'picked-up'
          });
        } catch (e) {}
      } catch (e) {
        console.error('computeOrderETA error:', e.message);
      }
      // If delivered, update driver delivery stats
      if (status === 'delivered' && updatedOrder.driverId) {
        try {
          await updateDriverDeliveryStats(updatedOrder.driverId);
        } catch (e) {
          console.error('updateDriverDeliveryStats error:', e.message);
        }
      }
      // If cancelled by driver, record cancellation
      if (status === 'cancelled' && updatedOrder.driverId) {
        try {
          await recordDriverCancellation(updatedOrder.driverId);
        } catch (e) {
          console.error('recordDriverCancellation error:', e.message);
        }
      }
    } catch (e) {
      console.error('Failed to update analytics timestamps:', e.message);
    }
  }

  emitOrderUpdate(orderId, { type: 'driver-status', status });
  emitBranchUpdate(order.branchId, { type: 'driver-status', orderId, status });
  emitManagerUpdate(order.branchId, { type: 'driver-status', orderId, status });
  emitAndNotifyCustomer(orderId, { type: 'driver-status', status });

  res.json({ success: true });
}
