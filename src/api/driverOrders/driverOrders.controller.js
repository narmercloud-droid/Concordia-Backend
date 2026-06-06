import { PrismaClient } from '@prisma/client';
import { getIO } from '../../realtime/socket.js';
import { sendNotification } from '../../services/notifications/notification.service.js';

const prisma = new PrismaClient();

export async function getActiveOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        driverId: req.driverId,
        status: { in: ['accepted', 'preparing', 'ready', 'out_for_delivery'] }
      },
      include: { branch: true }
    });

    res.json(orders);

  } catch (error) {
    console.error('Get active orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function driverUpdateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    await sendNotification(status, {
      orderId: order.id,
      customerId: order.customerId,
      driverId: order.driverId,
      status
    });

    const io = getIO();

    io.to(`order:${orderId}`).emit('status:update', status);
    io.to(`driver:${order.driverId}:orders`).emit('order:update', order);
    io.to(`branch:${order.branchId}:orders`).emit('order:update', order);

    res.json({ success: true, order });

  } catch (error) {
    console.error('Driver update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
