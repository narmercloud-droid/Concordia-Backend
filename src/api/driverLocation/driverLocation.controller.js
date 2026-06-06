import { PrismaClient } from '@prisma/client';
import { getIO } from '../../realtime/socket.js';

const prisma = new PrismaClient();

export async function updateDriverLocation(req, res) {
  try {
    const driverId = req.body.driverId;
    const { lat, lng } = req.body;

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { lat, lng }
    });

    const io = getIO();

    io.to(`driver:${driverId}:orders`).emit('driver:location', { lat, lng });

    // Broadcast DRIVER_LOCATION via new WS helper
    try {
      const { getIO: getWS } = await import('../../ws/ws.js');
      const { WS_EVENTS } = await import('../../ws/events.js');
      const ws = getWS();
      ws.emit(WS_EVENTS.DRIVER_LOCATION, {
        driverId,
        lat,
        lng,
        timestamp: new Date()
      });
    } catch (e) {
      // ignore
    }

    return res.json({ success: true });

  } catch (error) {
    console.error('Driver location update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
