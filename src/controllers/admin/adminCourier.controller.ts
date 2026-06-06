import { prisma } from "../../prisma/client.ts";
import { generateCourierToken } from "../../services/courier/courierToken.service.ts";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const assignCourier = wrap(async (req) => {
  try {
    const { orderId, courierId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw fail('NOT_FOUND', 'Order not found');

    const token = await generateCourierToken(orderId);

    await OrderLifecycleService.updateStatus(orderId, "courier_assigned", undefined, {
      courierId,
      courierStatus: "assigned"
    });

    return {
      success: true,
      courierToken: token,
      qrUrl: `${process.env.PUBLIC_URL}/courier/order?token=${token}`
    };
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Server error');
  }
});

