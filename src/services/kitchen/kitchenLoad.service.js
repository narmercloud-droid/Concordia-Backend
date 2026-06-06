import { PrismaClient } from '@prisma/client';
import { getIO } from '../../ws/ws.js';
import { WS_EVENTS } from '../../ws/events.js';
const prisma = new PrismaClient();

// Calculate load based on active orders
export async function calculateKitchenLoad(branchId) {
  const activeOrders = await prisma.order.count({
    where: {
      branchId,
      status: { in: ['confirmed', 'preparing'] }
    }
  });

  if (activeOrders < 5) return 0;     // normal
  if (activeOrders < 12) return 1;    // busy
  return 2;                           // very busy
}

// Adjust prep time dynamically
export async function getDynamicPrepTime(branchId) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });

  const load = await calculateKitchenLoad(branchId);

  let multiplier = 1;

  if (load === 1) multiplier = 1.3;     // busy
  if (load === 2) multiplier = 1.6;     // very busy

  const baseline = branch?.avgPrepTimeBaseline ?? 15;
  const dynamicTime = Math.round(baseline * multiplier);

  return { dynamicTime, load };
}

// Update branch load level
export async function updateBranchLoad(branchId) {
  const load = await calculateKitchenLoad(branchId);

  const updated = await prisma.branch.update({
    where: { id: branchId },
    data: { currentLoadLevel: load }
  });

  try {
    const io = getIO();
    io.emit(WS_EVENTS.KITCHEN_LOAD_UPDATE || 'kitchen_load_update', {
      branchId,
      load
    });
  } catch (e) {
    // ignore if ws not initialized
  }

  return load;
}
