import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { validateCourierToken } from "./courierToken.service.ts";
import { autoUpdateStatus } from "./autoStatus.service.ts";
import { broadcastToTerminal, broadcastToCustomer } from "../realtime/realtime.service.ts";
import { getBranchCoords, getGuestCourierId } from "../branch/branchCoords.service.ts";
import { OrderLifecycleService } from "../order/orderLifecycle.service.ts";

function buildNavigationUrl(order: {
  deliveryAddress?: string | null;
  deliveryLat?: number | null;
  deliveryLng?: number | null;
  branch?: { name?: string | null } | null;
}) {
  const address = (order.deliveryAddress ?? "").trim();
  if (!address) return null;

  // Use the full street address — Google Maps geocodes it reliably for drivers.
  // Stored lat/lng from backend geocoding can point to the wrong house or PLZ center.
  const params = new URLSearchParams({
    api: "1",
    destination: address,
    travelmode: "driving"
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export async function buildCourierOrderView(order: any) {
  const branchCoords = await getBranchCoords(order.branchId);
  const destination = order.deliveryAddress ?? "";

  return {
    orderId: order.id,
    status: order.status,
    courierStatus: order.courierStatus,
    fulfillmentType: order.fulfillmentType,
    customerName: order.customerName ?? order.customer?.name ?? "Guest",
    customerPhone: order.customerPhone ?? order.customer?.phone ?? null,
    deliveryAddress: order.deliveryAddress,
    deliveryLat: order.deliveryLat,
    deliveryLng: order.deliveryLng,
    items: order.items.map((i: any) => ({
      name: i.item?.name ?? i.name,
      quantity: i.quantity,
      notes: i.notes,
      price: i.price
    })),
    branch: {
      name: order.branch?.name,
      address: branchCoords?.address ?? null,
      lat: branchCoords?.lat ?? null,
      lng: branchCoords?.lng ?? null
    },
    navigationUrl: buildNavigationUrl(order),
    driverAccepted: !!order.driverAcceptedAt
  };
}

export async function acceptCourierOrder(token: string) {
  const order = await validateCourierToken(token);
  if (!order) throw new Error("Invalid or expired driver link");

  if (order.driverAcceptedAt) {
    return buildCourierOrderView(order);
  }

  const courierId = order.courierId ?? (await getGuestCourierId(order.branchId));

  await prisma.order.update({
    where: { id: order.id },
    data: {
      courierStatus: "accepted",
      driverAcceptedAt: new Date(),
      courierId
    }
  });

  const transitStatuses = new Set(["accepted", "preparing", "ready_for_pickup", "ready"]);
  let updated = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      branch: true,
      items: { include: { item: true, variants: true, extras: true } },
      customer: { include: { addresses: true } }
    }
  });

  if (updated && transitStatuses.has(updated.status)) {
    try {
      await OrderLifecycleService.updateStatus(order.id, "out_for_delivery");
      updated = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          branch: true,
          items: { include: { item: true, variants: true, extras: true } },
          customer: { include: { addresses: true } }
        }
      });
    } catch {
      // Keep driver acceptance even if status transition is not allowed.
    }
  }

  if (!updated) {
    throw new Error("Order not found after driver acceptance");
  }

  broadcastToTerminal(updated.branchId, "order_update", updated);
  broadcastToTerminal(updated.branchId, "order_status", {
    orderId: updated.id,
    status: updated.status,
    courierStatus: "accepted",
    order: updated
  });

  if (updated.tracking_token) {
    broadcastToCustomer(updated.tracking_token, "order_status", {
      status: updated.status,
      courierStatus: "accepted"
    });
  }

  return buildCourierOrderView(updated);
}

export async function updateDriverLocation(
  token: string,
  lat: number,
  lng: number,
  accuracy?: number
) {
  const order = await validateCourierToken(token);
  if (!order) throw new Error("Invalid or expired driver link");

  if (!order.driverAcceptedAt) {
    throw new Error("Driver must accept the order before sharing location");
  }

  if (!order.courierId) {
    throw new Error("Order is missing courier assignment");
  }

  await prisma.courierLocation.create({
    data: {
      id: randomUUID(),
      latitude: lat,
      longitude: lng,
      accuracy: accuracy ?? null,
      courier: { connect: { id: order.courierId } },
      order: { connect: { id: order.id } }
    }
  });

  const statusChanged = await autoUpdateStatus(order, lat, lng);

  broadcastToTerminal(order.branchId, "courier_location", {
    orderId: order.id,
    lat,
    lng
  });

  if (order.tracking_token) {
    broadcastToCustomer(order.tracking_token, "courier_location", {
      lat,
      lng,
      orderId: order.id
    });
  }

  return { success: true, statusChanged };
}
