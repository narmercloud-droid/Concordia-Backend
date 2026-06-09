import { prisma } from "../../prisma/client.js";
import { broadcastToTerminal, broadcastToCustomer } from "../realtime/realtime.service.js";
import { haversineDistance } from "../../utils/distance.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
import { getBranchCoords } from "../branch/branchCoords.service.js";
export async function autoUpdateStatus(order, courierLat, courierLng) {
    if (order.courierStatus !== "accepted" && order.courierStatus !== "picked_up") {
        return null;
    }
    const branchCoords = await getBranchCoords(order.branchId);
    const customerLat = order.deliveryLat;
    const customerLng = order.deliveryLng;
    if (branchCoords && order.courierStatus === "accepted") {
        const distToRestaurant = haversineDistance(courierLat, courierLng, branchCoords.lat, branchCoords.lng);
        if (distToRestaurant < 150) {
            await OrderLifecycleService.updateCourierStatus(order.id, "picked_up");
            await prisma.order.update({
                where: { id: order.id },
                data: { pickedUpAt: new Date() }
            });
            broadcastToTerminal(order.branchId, "order_status", {
                orderId: order.id,
                courierStatus: "picked_up"
            });
            if (order.tracking_token) {
                broadcastToCustomer(order.tracking_token, "order_status", {
                    courierStatus: "picked_up"
                });
            }
            return "picked_up";
        }
    }
    if (customerLat != null &&
        customerLng != null &&
        order.courierStatus === "picked_up") {
        const distToCustomer = haversineDistance(courierLat, courierLng, customerLat, customerLng);
        if (distToCustomer < 120) {
            await OrderLifecycleService.updateCourierStatus(order.id, "delivered");
            await prisma.order.update({
                where: { id: order.id },
                data: { deliveredAt: new Date(), status: "delivered" }
            });
            broadcastToTerminal(order.branchId, "order_status", {
                orderId: order.id,
                status: "delivered",
                courierStatus: "delivered"
            });
            if (order.tracking_token) {
                broadcastToCustomer(order.tracking_token, "order_status", {
                    status: "delivered",
                    courierStatus: "delivered"
                });
            }
            return "delivered";
        }
    }
    return null;
}
