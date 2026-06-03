import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCustomerOrderStatus(req, res) {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      driver: true,
      branch: true
    }
  });

  res.json({
    orderId: order.id,
    status: order.status,
    kitchenStatus: order.kitchenStatus,
    driver: order.driver ? {
      id: order.driver.id,
      name: order.driver.name
    } : null
  });
}
