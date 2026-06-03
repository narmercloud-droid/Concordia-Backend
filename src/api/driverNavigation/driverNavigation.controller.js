import { PrismaClient } from '@prisma/client';
import { haversineDistance } from '../../utils/distance.js';

const prisma = new PrismaClient();

export async function getOrderNavigation(req, res) {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { branch: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const distance = haversineDistance(
      order.branch.lat,
      order.branch.lng,
      order.customerLat,
      order.customerLng
    );

    res.json({
      branch: {
        lat: order.branch.lat,
        lng: order.branch.lng
      },
      customer: {
        lat: order.customerLat,
        lng: order.customerLng
      },
      distance
    });

  } catch (error) {
    console.error('Driver navigation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
