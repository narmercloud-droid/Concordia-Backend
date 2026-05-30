import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Load lifecycle env
const lifecyclePath = path.resolve(process.cwd(), ".env.lifecycle");
if (fs.existsSync(lifecyclePath)) {
  const parsed = dotenv.parse(fs.readFileSync(lifecyclePath));
  for (const [k, v] of Object.entries(parsed)) {
    process.env[k] = v;
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set in .env.lifecycle");
  process.exit(1);
}

// Ensure we don't accidentally allow SQLite here
if (process.env.DATABASE_URL.startsWith("file:") && process.env.LIFECYCLE_ALLOW_SQLITE !== "true") {
  console.error("DATABASE_URL points to SQLite. Set LIFECYCLE_ALLOW_SQLITE=true to allow running integration tests against SQLite.");
  process.exit(1);
}

import { prisma } from "../../dist/prisma/client.js";
import { OrderLifecycleService } from "../../dist/services/order/orderLifecycle.service.js";
import { runLifecycleChecks } from "../../dist/jobs/lifecycleScheduler.js";

async function createTestOrder() {
  const branchId = randomUUID();
  const orderId = randomUUID();

  await prisma.branch.create({ data: { id: branchId, name: "Integration Test Branch", printerType: "kitchen" } });

  const order = await prisma.order.create({
    data: {
      id: orderId,
      branchId,
      paymentMethod: "test",
      paymentStatus: "pending",
      status: "pending"
    }
  });

  await prisma.orderTrackingEvent.create({ data: { id: randomUUID(), orderId, status: "created", timestamp: new Date() } });

  return { order, branchId };
}

async function cleanup(orderId, branchId) {
  try {
    // remove any test courier created
    await prisma.courier.deleteMany({ where: { branchId } });
  } catch (e) {
    console.warn("Cleanup courier delete error", e.message || e);
  }
  try {
    await prisma.orderTrackingEvent.deleteMany({ where: { orderId } });
  } catch (e) {
    console.warn("Cleanup tracking events error", e.message || e);
  }
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch (e) {
    console.warn("Cleanup order delete error", e.message || e);
  }
  try {
    await prisma.branch.delete({ where: { id: branchId } });
  } catch (e) {
    console.warn("Cleanup branch delete error", e.message || e);
  }
}

async function run() {
  console.log("Starting integration tests against:", process.env.DATABASE_URL.slice(0, 80) + "...");
  const { order, branchId } = await createTestOrder();
  const orderId = order.id;
  console.log("Created order", orderId);

  try {
    // Test setCourierToken via lifecycle
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
    const withToken = await prisma.order.findUnique({ where: { id: orderId } });
    if (!withToken || withToken.courierToken !== token) throw new Error("setCourierToken failed");
    console.log("setCourierToken OK");

    // Test assignCourier - create a courier record first (foreign key constraint)
    const testCourierId = "courier_test_1";
    await prisma.courier.upsert({
      where: { id: testCourierId },
      update: { branchId, name: "Test Courier", email: `${testCourierId}@example.com`, phone: "000" },
      create: { id: testCourierId, name: "Test Courier", email: `${testCourierId}@example.com`, phone: "000", branchId }
    });
    await OrderLifecycleService.assignCourier(orderId, testCourierId);
    const assigned = await prisma.order.findUnique({ where: { id: orderId } });
    if (!assigned || assigned.courierId !== "courier_test_1") throw new Error("assignCourier failed");
    console.log("assignCourier OK");

    // Test updateCourierStatus
    await OrderLifecycleService.updateCourierStatus(orderId, "accepted");
    const statusUpdated = await prisma.order.findUnique({ where: { id: orderId } });
    if (!statusUpdated || statusUpdated.courierStatus !== "accepted") throw new Error("updateCourierStatus failed");
    console.log("updateCourierStatus OK");

    // Test payment update
    await OrderLifecycleService.updatePaymentStatus(orderId, "PAID", { paidAt: new Date() });
    const paid = await prisma.order.findUnique({ where: { id: orderId }, include: { trackingEvents: { orderBy: { timestamp: "asc" } } } });
    if (!paid || paid.paymentStatus !== "PAID") throw new Error("updatePaymentStatus failed");
    const lastPaymentEvent = paid.trackingEvents[paid.trackingEvents.length - 1];
    if (!lastPaymentEvent || !lastPaymentEvent.status.startsWith("payment:")) throw new Error("payment tracking event missing");
    console.log("updatePaymentStatus OK and tracking event present");

    // Test token expiration & scheduler clearing
    // Manually expire token via direct update (for test)
    await prisma.order.update({ where: { id: orderId }, data: { courierTokenExpiresAt: new Date(Date.now() - 1000 * 60) } });
    // Run lifecycle checks to clear expired tokens
    await runLifecycleChecks();
    const cleared = await prisma.order.findUnique({ where: { id: orderId } });
    if (cleared.courierToken) throw new Error("clearCourierToken via scheduler failed");
    console.log("Token expiration cleared by scheduler OK");

    console.log("Integration tests PASSED");
  } catch (err) {
    console.error("Integration tests FAILED:", err);
    process.exitCode = 1;
  } finally {
    await cleanup(orderId, branchId);
    await prisma.$disconnect();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
