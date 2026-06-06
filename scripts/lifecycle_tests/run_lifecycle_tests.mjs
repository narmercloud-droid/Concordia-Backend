import { randomUUID } from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load lifecycle env explicitly so tests use .env.lifecycle
const lifecyclePath = path.resolve(process.cwd(), ".env.lifecycle");
if (fs.existsSync(lifecyclePath)) {
  const parsed = dotenv.parse(fs.readFileSync(lifecyclePath));
  // apply lifecycle env values but do not overwrite an explicit runtime env unless FORCE is set
  for (const [k, v] of Object.entries(parsed)) {
    // Force apply lifecycle env values so tests run against the intended DB
    process.env[k] = v;
  }
}

// Guard: skip lifecycle tests if DATABASE_URL is missing or clearly a placeholder
const dbUrl = (process.env.DATABASE_URL || "").trim();
if (!dbUrl) {
  console.warn("Skipping lifecycle tests: DATABASE_URL is not set.");
  process.exit(0);
}

// Skip if using Neon placeholder credentials
// If the URL appears to include Neon owner placeholder, allow a forced override
if ((dbUrl.includes("neondb_owner") || dbUrl.includes("<YOUR_NEON")) && process.env.LIFECYCLE_FORCE !== "true") {
  console.warn("Skipping lifecycle tests: DATABASE_URL contains placeholder Neon credentials. Set LIFECYCLE_FORCE=true to override.");
  process.exit(0);
}

// If DATABASE_URL points to a file-based SQLite, only proceed when explicitly allowed
if (dbUrl.startsWith("file:") && process.env.LIFECYCLE_ALLOW_SQLITE !== "true") {
  console.warn("Skipping lifecycle tests: DATABASE_URL points to SQLite file. Set LIFECYCLE_ALLOW_SQLITE=true to allow.");
  process.exit(0);
}

import { prisma } from "../../dist/prisma/client.js";
import { OrderLifecycleService } from "../../dist/services/order/orderLifecycle.service.js";

const TEST_PAYMENT_METHOD = "test";

async function setupOrder() {
  const branchId = randomUUID();
  const orderId = randomUUID();

  await prisma.branch.create({
    data: {
      id: branchId,
      name: "Lifecycle Test Branch",
      printerType: "kitchen"
    }
  });

  const order = await prisma.order.create({
    data: {
      id: orderId,
      branchId,
      paymentMethod: TEST_PAYMENT_METHOD,
      paymentStatus: "pending",
      status: "pending"
    }
  });

  await prisma.orderTrackingEvent.create({
    data: {
      id: randomUUID(),
      orderId,
      status: "created",
      timestamp: new Date()
    }
  });

  return { order, branchId };
}

async function cleanupOrder(orderId, branchId) {
  await prisma.orderTrackingEvent.deleteMany({ where: { orderId } });
  await prisma.order.delete({ where: { id: orderId } });
  await prisma.branch.delete({ where: { id: branchId } });
}

async function run() {
  const { order, branchId } = await setupOrder();
  const orderId = order.id;
  const transitions = [
    ["created", "accepted"],
    ["accepted", "preparing"],
    ["preparing", "ready_for_pickup"],
    ["ready_for_pickup", "picked_up"],
    ["picked_up", "delivered"]
  ];

  let currentStatus = "created";
  const results = [];

  try {
    for (const [from, to] of transitions) {
      if (currentStatus !== from) {
        throw new Error(`Expected current status ${from} before transitioning to ${to}, got ${currentStatus}`);
      }

      const updated = await OrderLifecycleService.updateStatus(orderId, to);
      const lastEvent = updated.trackingEvents[updated.trackingEvents.length - 1];

      const passed = updated.status === to && lastEvent?.status === to;
      results.push({ from, to, passed, updatedStatus: updated.status, lastEventStatus: lastEvent?.status });
      if (!passed) {
        throw new Error(`Transition ${from} -> ${to} failed: status=${updated.status} event=${lastEvent?.status}`);
      }

      currentStatus = to;
    }

    console.log("LIFECYCLE TESTS PASSED\n");
    results.forEach((result) => {
      console.log(`PASS: ${result.from} -> ${result.to} | order.status=${result.updatedStatus} | lastEvent=${result.lastEventStatus}`);
    });
  } catch (error) {
    console.error("LIFECYCLE TESTS FAILED", error);
    process.exitCode = 1;
  } finally {
    await cleanupOrder(orderId, branchId);
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});