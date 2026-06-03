import { broadcastToTerminal, broadcastToCustomer } from "../realtime/realtime.service.ts";
import { haversineDistance } from "../../utils/distance.ts";
import { OrderLifecycleService } from "../order/orderLifecycle.service.ts";

export async function autoUpdateStatus(order, courierLat, courierLng) {
  const customerAddress = order.customer?.addresses?.[0];
  if (!customerAddress) return;

  const restaurantLat = (order.branch as any).lat;
  const restaurantLng = (order.branch as any).lng;

  const customerLatVal = customerAddress.lat;
  const customerLngVal = customerAddress.lng;

  const distToRestaurant = haversineDistance(
    courierLat,
    courierLng,
    restaurantLat,
    restaurantLng
  );

  const distToCustomer = haversineDistance(
    courierLat,
    courierLng,
    customerLatVal,
    customerLngVal
  );

  // Auto: picked_up
  if (
    order.courierStatus !== "picked_up" &&
    distToRestaurant < 150
  ) {
    await OrderLifecycleService.updateStatus(order.id, "picked_up", undefined, {
      courierStatus: "picked_up"
    });

    broadcastToTerminal(order.branchId, "order_status", {
      orderId: order.id,
      status: "picked_up"
    });

    broadcastToCustomer(order.tracking_token, "order_status", {
      status: "picked_up"
    });

    return "picked_up";
  }

  // Auto: delivered
  if (
    order.courierStatus !== "delivered" &&
    distToCustomer < 120
  ) {
    await OrderLifecycleService.updateStatus(order.id, "delivered", undefined, {
      courierStatus: "delivered"
    });

    broadcastToTerminal(order.branchId, "order_status", {
      orderId: order.id,
      status: "delivered"
    });

    broadcastToCustomer(order.tracking_token, "order_status", {
      status: "delivered"
    });

    return "delivered";
  }

  return null;
}

