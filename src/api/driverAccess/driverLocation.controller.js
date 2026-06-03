import { emitOrderUpdate, emitBranchUpdate, emitAndNotifyCustomer, emitManagerUpdate } from '../../realtime/emitters.js';
import { emitDriverLocation } from '../../realtime/emitters.js';

export async function updateDriverLocation(req, res) {
  const { driverId, orderId, branchId, lat, lng } = req.body;

  emitOrderUpdate(orderId, {
    type: 'driver-location',
    lat,
    lng
  });

  emitBranchUpdate(branchId, {
    type: 'driver-location',
    driverId,
    lat,
    lng
  });

  // also emit driver location to underscores-based order room
  emitDriverLocation(orderId, { lat, lng });

  // notify customer room and send notifications
  emitAndNotifyCustomer(orderId, {
    type: 'driver-location',
    lat,
    lng
  });

  // notify managers in branch dashboard
  emitManagerUpdate(branchId, {
    type: 'driver-location',
    driverId,
    lat,
    lng
  });

  res.json({ success: true });
}
