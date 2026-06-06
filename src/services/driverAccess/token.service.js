import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SECRET = process.env.DRIVER_QR_SECRET || 'driver_qr_secret';

export async function generateDriverToken(orderId) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(orderId + token + expiresAt.getTime())
    .digest('hex');

  await prisma.driverAccessToken.create({
    data: { orderId, token, expiresAt }
  });

  return {
    orderId,
    token,
    expiresAt: expiresAt.getTime(),
    signature
  };
}

export async function validateDriverToken(orderId, token, expiresAt, signature) {
  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(orderId + token + expiresAt)
    .digest('hex');

  if (expectedSig !== signature) return null;

  const record = await prisma.driverAccessToken.findUnique({
    where: { token }
  });

  if (!record) return null;
  if (record.used) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  return record;
}

export async function markTokenUsed(token) {
  await prisma.driverAccessToken.update({
    where: { token },
    data: { used: true }
  });
}
