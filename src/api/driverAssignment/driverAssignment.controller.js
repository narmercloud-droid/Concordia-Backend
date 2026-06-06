import { PrismaClient } from '@prisma/client';
import { getIO } from '../../realtime/socket.js';

const prisma = new PrismaClient();

export async function assignDriver(req, res) {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        driverId,
        status: 'out_for_delivery'
      },
      include: { branch: true, driver: true }
    });

    const io = getIO();

    io.to(`order:${orderId}`).emit('status:update', 'out_for_delivery');
    io.to(`branch:${order.branchId}:orders`).emit('order:update', order);
    io.to(`driver:${driverId}:orders`).emit('order:update', order);

    return res.json({ success: true, order });

  } catch (error) {
    console.error('Driver assignment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
