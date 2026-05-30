import { prisma } from "../../prisma/client.js";
import { broadcastToCustomer } from "../../services/realtime/realtime.service.js";
import { success, fail } from "../controllerHelper.js";

export const getCustomerTracking = async (req, res) => {
  try {
    const { token } = req.params;

    const order = await prisma.order.findFirst({
      where: { tracking_token: token },
      include: {
        customer: { include: { addresses: true } },
        branch: true,
        items: { include: { item: true } },
        trackingEvents: { orderBy: { timestamp: "asc" } },
        courierLocations: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    });

    if (!order) return fail(res, "Invalid tracking token", 404);

    const response = {
      orderId: order.id,
      status: order.status,
      courierStatus: order.courierStatus,
      timeline: order.trackingEvents,
      courierLocation: order.courierLocations[0] || null,
      items: order.items.map(i => ({
        name: i.item.name,
        quantity: i.quantity,
        notes: i.notes
      })),
      branch: {
        name: (order.branch as any).name,
        address: (order.branch as any).address || null,
        lat: (order.branch as any).lat ?? null,
        lng: (order.branch as any).lng ?? null
      },
      customerAddress: order.customer.addresses?.[0] || null
    };

    broadcastToCustomer(token, "tracking_update", response);
    return success(res, response);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500);
  }
};

