import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveSubscription(req, res) {
  const { userId, subscription } = req.body;

  try {
    await prisma.customer.update({
      where: { id: userId },
      data: { pushSubscription: subscription }
    });

    res.json({ success: true });
  } catch (e) {
    console.error('Save subscription error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
