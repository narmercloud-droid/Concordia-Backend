import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export async function generateTimeSlots(branchId) {
  const now = new Date();
  const day = now.getDay();

  const hours = await prisma.branchHours.findUnique({
    where: { branchId_dayOfWeek: { branchId, dayOfWeek: day } }
  });

  if (!hours) return [];

  const open = toMinutes(hours.openTime);
  const close = toMinutes(hours.closeTime);

  const slots = [];

  for (let t = open; t < close; t += 30) {
    const hour = Math.floor(t / 60);
    const min = t % 60;

    const slot = new Date();
    slot.setHours(hour, min, 0, 0);

    if (slot > now) {
      slots.push(slot);
    }
  }

  return slots;
}

export async function validateScheduledTime(branchId, scheduledFor) {
  const date = new Date(scheduledFor);
  const day = date.getDay();

  const hours = await prisma.branchHours.findUnique({
    where: { branchId_dayOfWeek: { branchId, dayOfWeek: day } }
  });

  if (!hours) return false;

  const minutes = date.getHours() * 60 + date.getMinutes();
  const open = toMinutes(hours.openTime);
  const close = toMinutes(hours.closeTime);

  return minutes >= open && minutes <= close;
}
