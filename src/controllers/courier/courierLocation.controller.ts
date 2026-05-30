import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import { validateCourierToken } from "../../services/courier/courierToken.service.js";
import { autoUpdateStatus } from "../../services/courier/autoStatus.service.js";
import { broadcastToTerminal, broadcastToCustomer } from "../../services/realtime/realtime.service.js";
import { success, fail } from "../controllerHelper.js";

export const updateCourierLocation = async (req, res) => {
  try {
    const { token, lat, lng, accuracy } = req.body;

    const order = await validateCourierToken(token);
    if (!order) {
      return fail(res, "Invalid or expired token", 401);
    }

    // Save location (schema uses latitude/longitude)
    await prisma.courierLocation.create({
      data: {
        id: randomUUID(),
        latitude: lat,
        longitude: lng,
        accuracy: accuracy ?? null,
        courier: { connect: { id: order.courierId } },
        order: order.id ? { connect: { id: order.id } } : undefined
      }
    });

    // Auto-status logic
    const statusChanged = await autoUpdateStatus(order, lat, lng);

    broadcastToTerminal(order.branchId, "courier_location", {
      orderId: order.id,
      lat,
      lng
    });

    broadcastToCustomer(order.tracking_token, "courier_location", {
      lat,
      lng
    });

    if (statusChanged) {
      broadcastToTerminal(order.branchId, "order_status", {
        orderId: order.id,
        status: statusChanged
      });

      broadcastToCustomer(order.tracking_token, "order_status", {
        status: statusChanged
      });
    }

    return success(res, {
      success: true,
      statusChanged
    });
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500);
  }
};

