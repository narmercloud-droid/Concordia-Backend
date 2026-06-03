import { PrismaClient } from '@prisma/client';
import { generateTimeSlots, validateScheduledTime } from '../../services/scheduling/scheduling.service.js';

const prisma = new PrismaClient();

export async function getAvailableSlots(req, res) {
  const { branchId } = req.params;

  const slots = await generateTimeSlots(branchId);

  res.json({ branchId, slots });
}

export async function scheduleOrder(req, res) {
  const { orderId, branchId, scheduledFor } = req.body;

  const valid = await validateScheduledTime(branchId, scheduledFor);

  if (!valid) {
    return res.status(400).json({ error: 'Invalid scheduled time' });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { scheduledFor: new Date(scheduledFor) }
  });

  res.json(order);
}
