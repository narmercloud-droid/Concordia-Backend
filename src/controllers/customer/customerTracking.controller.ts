import { prisma } from "../../prisma/client.ts";
import { getBranchCoords } from "../../services/branch/branchCoords.service.ts";
import { broadcastToCustomer } from "../../services/realtime/realtime.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export const getCustomerTracking = wrap(async (req) => {
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

    if (!order) throw fail("NOT_FOUND", "Invalid tracking token");

    const branchCoords = await getBranchCoords(order.branchId);
    const latestLocation = order.courierLocations[0];

    const response = {
      orderId: order.id,
      status: order.status,
      courierStatus: order.courierStatus,
      timeline: order.trackingEvents,
      courierLocation: latestLocation
        ? {
            lat: latestLocation.latitude,
            lng: latestLocation.longitude,
            updatedAt: latestLocation.createdAt
          }
        : null,
      items: order.items.map((i) => ({
        name: i.item.name,
        quantity: i.quantity,
        notes: i.notes
      })),
      branch: {
        name: order.branch.name,
        address: branchCoords?.address ?? null,
        lat: branchCoords?.lat ?? null,
        lng: branchCoords?.lng ?? null
      },
      deliveryAddress: order.deliveryAddress,
      deliveryLat: order.deliveryLat,
      deliveryLng: order.deliveryLng,
      driverAccepted: !!order.driverAcceptedAt
    };

    broadcastToCustomer(token, "tracking_update", response);
    return response;
  } catch (err) {
    console.error(err);
    throw fail("INTERNAL_ERROR", "Server error");
  }
});
