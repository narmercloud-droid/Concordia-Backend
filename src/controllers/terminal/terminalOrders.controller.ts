import { prisma } from "../../prisma/client.js";
import { broadcastToTerminal } from "../../services/realtime/realtime.service.js";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.js";
import { success, fail } from "../controllerHelper.js";

export const getTerminalOrders = async (req, res) => {
  try {
    const { branchId } = req.query;

    const orders = await prisma.order.findMany({
      where: { branchId },
      include: {
        trackingEvents: true,
        courierLocations: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return success(res, orders);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500);
  }
};

export const getTerminalOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        trackingEvents: true,
        courierLocations: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        items: {
          include: { item: true }
        },
        customer: {
          include: { addresses: true }
        }
      }
    });

    if (!order) return fail(res, "Order not found", 404);

    const response = order;
    broadcastToTerminal(order.branchId, "order_update", order);
    return success(res, response);
  } catch (err) {
    console.error(err);
    return fail(res, "Server error", 500);
  }
};

export const acceptOrder = async (req, res) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "accepted");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return success(res, updated);
};

export const rejectOrder = async (req, res) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "rejected");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return success(res, updated);
};

