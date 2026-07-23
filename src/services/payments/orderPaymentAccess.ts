import type { Request } from "express";
import { prisma } from "../../prisma/client.ts";
import { fail } from "../../contracts/api.js";

type OrderAccessFields = {
  id: string;
  customerId: string | null;
  isGuest: boolean;
  tracking_token: string | null;
};

export async function loadOrderForPaymentAccess(orderId: string): Promise<OrderAccessFields> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      customerId: true,
      isGuest: true,
      tracking_token: true
    }
  });
  if (!order) throw fail("NOT_FOUND", "Order not found");
  return order;
}

/**
 * Soft ownership for payment cancel/confirm/reconcile.
 * Blocks cross-customer access when both sides are identified.
 */
export function assertOrderPaymentAccess(req: Request, order: OrderAccessFields): void {
  const customerId =
    (req as Request & { customer?: { id?: string } }).customer?.id ?? null;

  const trackingToken = String(
    req.body?.trackingToken ??
      req.body?.tracking_token ??
      req.query?.trackingToken ??
      req.headers["x-order-token"] ??
      ""
  ).trim();

  if (customerId && order.customerId && customerId !== order.customerId) {
    throw fail("FORBIDDEN", "You do not have access to this order");
  }

  if (trackingToken && order.tracking_token && trackingToken !== order.tracking_token) {
    throw fail("FORBIDDEN", "You do not have access to this order");
  }
}
