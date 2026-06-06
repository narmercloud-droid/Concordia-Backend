import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
}

export async function generateRefreshToken(type, userId, userAgent) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (type === 'customer') {
    await prisma.customerSession.create({
      data: { customerId: userId, refreshToken: token, userAgent, expiresAt }
    });
  }

  if (type === 'manager') {
    await prisma.managerSession.create({
      data: { managerId: userId, refreshToken: token, userAgent, expiresAt }
    });
  }

  if (type === 'admin') {
    await prisma.adminSession.create({
      data: { adminId: userId, refreshToken: token, userAgent, expiresAt }
    });
  }

  return token;
}

export async function verifyRefreshToken(type, token) {
  if (type === 'customer') {
    return prisma.customerSession.findUnique({ where: { refreshToken: token } });
  }
  if (type === 'manager') {
    return prisma.managerSession.findUnique({ where: { refreshToken: token } });
  }
  if (type === 'admin') {
    return prisma.adminSession.findUnique({ where: { refreshToken: token } });
  }
}
