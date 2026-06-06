import { PrismaClient } from '@prisma/client';
import { createDriverSession } from '../../utils/driverSession.js';
import { emitOrderUpdate, emitBranchUpdate, emitManagerUpdate, emitCustomerUpdate } from '../../realtime/emitters.js';

const prisma = new PrismaClient();

export async function claimOrder(req, res) {
  const { orderId } = req.body;

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (order.driverSessionId) {
    return res.status(400).json({ error: 'Order already claimed' });
  }

  const sessionId = createDriverSession();

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { driverSessionId: sessionId }
  });

  emitOrderUpdate(orderId, {
    type: 'driver-assigned',
    driverSessionId: sessionId
  });

  emitBranchUpdate(order.branchId, {
    type: 'driver-assigned',
    orderId,
    driverSessionId: sessionId
  });

  emitManagerUpdate(order.branchId, {
    type: 'driver-assigned',
    orderId,
    driverSessionId: sessionId
  });

  emitCustomerUpdate(orderId, {
    type: 'driver-assigned',
    driverSessionId: sessionId
  });

  res.json({ success: true, driverSessionId: sessionId });
}
