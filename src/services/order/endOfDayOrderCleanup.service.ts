import { prisma } from "../../prisma/client.ts";
import logger from "../../logger.ts";
import { getBerlinTodayRange } from "../../utils/berlinTime.ts";
import { OrderLifecycleService } from "./orderLifecycle.service.ts";
import { advanceTerminalOrderStatus } from "../terminal/terminalOrderStatus.service.ts";
import {
  IN_PROGRESS_ORDER_STATUSES,
  TERMINAL_DONE_ORDER_STATUSES,
  UNPAID_ONLINE_PAYMENT_STATUSES
} from "./orderStatus.constants.ts";

function isPickupOrder(order: {
  fulfillmentType?: string | null;
  deliveryAddress?: string | null;
}) {
  if (order.deliveryAddress?.trim()) return false;
  const t = (order.fulfillmentType ?? "").toLowerCase();
  return t.includes("pickup") || t.includes("abhol");
}

function shouldCancelStaleOrder(order: {
  status: string;
  paymentStatus: string;
}) {
  if (UNPAID_ONLINE_PAYMENT_STATUSES.includes(order.paymentStatus as (typeof UNPAID_ONLINE_PAYMENT_STATUSES)[number])) {
    return true;
  }
  return order.status === "pending";
}

/**
 * At the start of each Berlin calendar day, close out yesterday's orders so they
 * do not stay active on the terminal or admin dashboard.
 */
export async function autoCompleteStaleOrders() {
  const { start: todayStart, ymd } = getBerlinTodayRange();

  const staleOrders = await prisma.order.findMany({
    where: {
      createdAt: { lt: todayStart },
      status: { in: [...IN_PROGRESS_ORDER_STATUSES] }
    },
    select: {
      id: true,
      branchId: true,
      status: true,
      paymentStatus: true,
      fulfillmentType: true,
      deliveryAddress: true,
      createdAt: true
    },
    orderBy: { createdAt: "asc" }
  });

  if (!staleOrders.length) {
    logger.info({ berlinDate: ymd }, "End-of-day order cleanup: nothing to close");
    return { closed: 0, cancelled: 0, skipped: 0 };
  }

  let closed = 0;
  let cancelled = 0;
  let skipped = 0;

  for (const order of staleOrders) {
    try {
      if (shouldCancelStaleOrder(order)) {
        await OrderLifecycleService.updateStatus(order.id, "cancelled");
        cancelled += 1;
        logger.info(
          { orderId: order.id, branchId: order.branchId, status: order.status },
          "Cancelled stale unpaid/unaccepted order at end of day"
        );
        continue;
      }

      const targetStatus = isPickupOrder(order) ? "picked_up" : "delivered";
      await advanceTerminalOrderStatus(order.id, targetStatus);
      closed += 1;
      logger.info(
        { orderId: order.id, branchId: order.branchId, targetStatus },
        "Auto-completed stale order at end of day"
      );
    } catch (err) {
      skipped += 1;
      logger.warn(
        { orderId: order.id, branchId: order.branchId, err },
        "Failed end-of-day order cleanup for order"
      );
    }
  }

  logger.info(
    { berlinDate: ymd, closed, cancelled, skipped, total: staleOrders.length },
    "End-of-day order cleanup finished"
  );

  return { closed, cancelled, skipped };
}

export function isTerminalDoneStatus(status: string) {
  return TERMINAL_DONE_ORDER_STATUSES.includes(
    status as (typeof TERMINAL_DONE_ORDER_STATUSES)[number]
  );
}
