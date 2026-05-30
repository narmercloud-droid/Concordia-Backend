import { prisma } from "../prisma/client.js";
import { OrderLifecycleService } from "../services/order/orderLifecycle.service.js";

const POLL_INTERVAL_MS = Number(process.env.LIFECYCLE_POLL_MS || 60_000); // default 1 minute

export async function runLifecycleChecks() {
  try {
    // Advance accepted -> preparing if accepted more than X minutes ago
    const acceptedCutoff = new Date(Date.now() - (Number(process.env.LIFECYCLE_ACCEPTED_TO_PREPARING_MIN || 2) * 60_000));
    const acceptedOrders = await prisma.order.findMany({ where: { status: "accepted", updatedAt: { lt: acceptedCutoff } } });
    for (const o of acceptedOrders) {
      try {
        console.log(`Auto-advancing order ${o.id} accepted -> preparing`);
        await OrderLifecycleService.updateStatus(o.id, "preparing");
      } catch (err) {
        console.warn(`Failed auto-advance for order ${o.id}:`, err?.message ?? err);
      }
    }

    // Advance preparing -> ready_for_pickup after configured minutes
    const preparingCutoff = new Date(Date.now() - (Number(process.env.LIFECYCLE_PREPARING_TO_READY_MIN || 5) * 60_000));
    const preparingOrders = await prisma.order.findMany({ where: { status: "preparing", updatedAt: { lt: preparingCutoff } } });
    for (const o of preparingOrders) {
      try {
        console.log(`Auto-advancing order ${o.id} preparing -> ready_for_pickup`);
        await OrderLifecycleService.updateStatus(o.id, "ready_for_pickup");
      } catch (err) {
        console.warn(`Failed auto-advance for order ${o.id}:`, err?.message ?? err);
      }
    }

    // Additional rules can be added here
    // Clear expired courier tokens
    const now = new Date();
    const expiredTokenOrders = await prisma.order.findMany({ where: { courierToken: { not: null }, courierTokenExpiresAt: { lt: now } } });
    for (const o of expiredTokenOrders) {
      try {
        console.log(`Clearing expired courier token for order ${o.id}`);
        await OrderLifecycleService.clearCourierToken(o.id);
      } catch (err) {
        console.warn(`Failed to clear courier token for order ${o.id}:`, err?.message ?? err);
      }
    }
  } catch (err) {
    console.error("Lifecycle checks failed:", err);
  }
}

export function startLifecycleScheduler() {
  if (process.env.LIFECYCLE_AUTOMATION_ENABLED === "false") {
    console.log("Lifecycle automation disabled via LIFECYCLE_AUTOMATION_ENABLED=false");
    return;
  }
  console.log(`Starting lifecycle scheduler (interval ${POLL_INTERVAL_MS}ms)`);
  runLifecycleChecks().catch((e) => console.error(e));
  setInterval(() => runLifecycleChecks(), POLL_INTERVAL_MS);
}
