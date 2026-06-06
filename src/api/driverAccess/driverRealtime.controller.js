import { emitOrderUpdate } from '../../realtime/emitters.js';

export async function driverUpdateStatus(req, res) {
  const { orderId, status } = req.body;

  emitOrderUpdate(orderId, {
    type: 'driver-update',
    status
  });

  res.json({ success: true });
}
