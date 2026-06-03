import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getSettings() {
  let settings = await prisma.loyaltySettings.findFirst();
  if (!settings) {
    settings = await prisma.loyaltySettings.create({ data: {} });
  }
  return settings;
}

export async function updateSettings(data) {
  const settings = await getSettings();
  return prisma.loyaltySettings.update({
    where: { id: settings.id },
    data
  });
}
