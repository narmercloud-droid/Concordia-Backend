import { validateCourierToken } from "../../services/courier/courierToken.service.ts";
import { broadcastToCourier } from "../../services/realtime/realtime.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const getCourierOrderView = wrap(async (req) => {
  try {
    const token = req.query.token as string;
    const order = await validateCourierToken(token);

    if (!order) {
      throw fail('UNAUTHORIZED', 'Invalid or expired token');
    }

    const response = {
      orderId: order.id,
      status: order.status,
      courierStatus: order.courierStatus,
      customer: {
        name: order.customer?.name,
        phone: order.customer?.phone
      },
      address: order.customer?.addresses?.[0] || null,
      items: order.items.map(i => ({
        name: i.item.name,
        quantity: i.quantity,
        notes: i.notes,
        price: i.price
      })),
      branch: {
        name: (order.branch as any).name,
        address: (order.branch as any).address || null,
        lat: (order.branch as any).lat ?? null,
        lng: (order.branch as any).lng ?? null
      },
      navigationUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer?.addresses?.[0]?.street || "")}`
    };

    broadcastToCourier(token, "connected", { ok: true });
    return response;
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Server error');
  }
});

