import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getCustomerOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customerId },
      include: { branch: true }
    });

    res.json(orders);

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCustomerOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { branch: true }
    });

    res.json(order);

  } catch (error) {
    console.error('Get customer order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
