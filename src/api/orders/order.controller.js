import { PrismaClient } from '@prisma/client';
import { selectBestBranch } from '../../services/branchSelection.service.js';
import { generateDriverToken } from '../../services/driverAccess/token.service.js';
import { generateDriverQrUrl } from '../../services/driverAccess/qr.service.js';
import { sendToPrinter } from '../../services/printing/printer.service.js';
import { buildOrderSlip } from '../../services/printing/slipTemplate.js';
import { emitBranchUpdate, emitAndNotifyCustomer } from '../../realtime/emitters.js';
import { autoAssignDriver } from '../../services/dispatch/dispatch.service.js';

const prisma = new PrismaClient();

export async function createOrder(req, res) {
  try {
    const { customer, cart, orderTotal, paymentMethod } = req.body;

    if (!customer?.lat || !customer?.lng) {
      return res.status(400).json({ error: 'Missing customer coordinates' });
    }

    const branchResult = await selectBestBranch(
      { lat: customer.lat, lng: customer.lng },
      orderTotal
    );

    if (!branchResult.deliverable) {
      return res.status(400).json(branchResult);
    }

    const order = await prisma.order.create({
      data: {
        branchId: branchResult.branchId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        customerLat: customer.lat,
        customerLng: customer.lng,

        deliveryFee: branchResult.deliveryFee,
        deliveryMethod: branchResult.method,
        deliveryDistance: branchResult.distance,

        orderTotal,
        paymentMethod,
        status: 'pending',

        items: {
          create: cart.map(item => ({
            menuItemId: item.itemId,
            quantity: item.quantity
          }))
        }
      },
      include: { items: true }
    });

    // Attempt automatic driver assignment
    try {
      await autoAssignDriver(order);
    } catch (e) {
      console.error('Auto-assign driver error:', e.message);
    }

    const qrPayload = await generateDriverToken(order.id);
    const qrImage = await generateDriverQrUrl(qrPayload);

    const branch = await prisma.branch.findUnique({
      where: { id: order.branchId }
    });

    const slip = buildOrderSlip(order, qrImage);

    await sendToPrinter(branch, slip);

    // Emit real-time notifications
    try {
      emitBranchUpdate(order.branchId, {
        type: 'new-order',
        orderId: order.id
      });
      // Notify customer realtime room and send notifications
      emitAndNotifyCustomer(order.id, {
        type: 'order-created',
        orderId: order.id,
        status: order.status
      });
    } catch (e) {
      console.error('Emit error:', e.message);
    }

    return res.json({ success: true, order, qrImage });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
