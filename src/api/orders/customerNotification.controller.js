import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerCustomerNotification(req, res) {
  const { orderId, phone, email, pushToken } = req.body;

  await prisma.order.update({
    where: { id: orderId },
    data: { customerPhone: phone, customerEmail: email, pushToken }
  });

  res.json({ success: true });
}
