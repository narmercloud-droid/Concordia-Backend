import { prisma } from "../prisma/client.ts";
import { OrderLifecycleService } from "../services/order/orderLifecycle.service.ts";
import logger from "../logger.ts";

const POLL_INTERVAL_MS = Number(process.env.LIFECYCLE_POLL_MS || 60_000); // default 1 minute

export async function runLifecycleChecks() {
  try {
    // Advance accepted -> preparing if accepted more than X minutes ago
    const acceptedCutoff = new Date(Date.now() - (Number(process.env.LIFECYCLE_ACCEPTED_TO_PREPARING_MIN || 2) * 60_000));
    const acceptedOrders = await prisma.order.findMany({ where: { status: "accepted", updatedAt: { lt: acceptedCutoff } } });
    for (const o of acceptedOrders) {
      try {
        logger.info({ orderId: o.id }, "Auto-advancing order accepted -> preparing");
        await OrderLifecycleService.updateStatus(o.id, "preparing");
      } catch (err) {
        logger.warn({ orderId: o.id, err }, "Failed auto-advance for order");
      }
    }

    // Advance preparing -> ready_for_pickup after configured minutes
    const preparingCutoff = new Date(Date.now() - (Number(process.env.LIFECYCLE_PREPARING_TO_READY_MIN || 5) * 60_000));
    const preparingOrders = await prisma.order.findMany({ where: { status: "preparing", updatedAt: { lt: preparingCutoff } } });
    for (const o of preparingOrders) {
      try {
        logger.info({ orderId: o.id }, "Auto-advancing order preparing -> ready_for_pickup");
        await OrderLifecycleService.updateStatus(o.id, "ready_for_pickup");
      } catch (err) {
        logger.warn({ orderId: o.id, err }, "Failed auto-advance for order");
      }
    }

    // Additional rules can be added here
    // Clear expired courier tokens
    const now = new Date();
    const expiredTokenOrders = await prisma.order.findMany({ where: { courierToken: { not: null }, courierTokenExpiresAt: { lt: now } } });
    for (const o of expiredTokenOrders) {
      try {
        logger.info({ orderId: o.id }, "Clearing expired courier token for order");
        await OrderLifecycleService.clearCourierToken(o.id);
      } catch (err) {
        logger.warn({ orderId: o.id, err }, "Failed to clear courier token for order");
      }
    }
  } catch (err) {
    logger.error({ err }, "Lifecycle checks failed");
  }
}

export function startLifecycleScheduler() {
  if (process.env.LIFECYCLE_AUTOMATION_ENABLED === "false") {
    logger.info("Lifecycle automation disabled via LIFECYCLE_AUTOMATION_ENABLED=false");
    return null;
  }
  logger.info({ intervalMs: POLL_INTERVAL_MS }, "Starting lifecycle scheduler");
  runLifecycleChecks().catch((e) => logger.error({ e }, "Lifecycle initial run failed"));
  const timer = setInterval(() => runLifecycleChecks(), POLL_INTERVAL_MS);
  return timer;
}
