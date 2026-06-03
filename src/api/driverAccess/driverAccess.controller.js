import { PrismaClient } from '@prisma/client';
import { validateDriverToken, markTokenUsed } from '../../services/driverAccess/token.service.js';

const prisma = new PrismaClient();

export async function driverAccessOrder(req, res) {
  try {
    const { o, t, e, s } = req.query;

    const record = await validateDriverToken(o, t, e, s);
    if (!record) return res.status(401).json({ error: 'Invalid or expired token' });

    const order = await prisma.order.findUnique({
      where: { id: o },
      include: { customer: true }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    await markTokenUsed(t);

    res.json({ order });

  } catch (error) {
    console.error('Driver access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
