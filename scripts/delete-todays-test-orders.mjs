/**
 * Delete test orders created for terminal/API smoke tests.
 * Matches guest orders with obvious test markers from today (UTC day window).
 *
 * Usage: node scripts/delete-todays-test-orders.mjs [--confirm]
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const confirm = process.argv.includes("--confirm");

function startOfTodayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

const TEST_NAME_PATTERNS = [
  "test",
  "terminal test",
  "test customer",
  "test lieferung",
];

function isTestOrder(order) {
  const name = (order.customerName ?? "").trim().toLowerCase();
  const notes = (order.notes ?? "").trim().toLowerCase();
  if (TEST_NAME_PATTERNS.some((p) => name === p || name.startsWith(p + " "))) return true;
  if (notes.includes("test order") || notes.includes("test print") || notes.includes("bitte stornieren")) {
    return true;
  }
  if (notes.includes("[promo]") && name === "test") return true;
  return false;
}

async function deleteOrders(orderIds) {
  if (orderIds.length === 0) return 0;

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: { in: orderIds } },
    select: { id: true },
  });
  const orderItemIds = orderItems.map((i) => i.id);

  if (orderItemIds.length > 0) {
    await prisma.orderItemExtra.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
    await prisma.orderItemVariant.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
    await prisma.itemRating.deleteMany({ where: { orderItemId: { in: orderItemIds } } });
    await prisma.orderItem.deleteMany({ where: { id: { in: orderItemIds } } });
  }

  await prisma.cartItem.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.courierLocation.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.driverRating.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.orderIssue.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.orderRiskEvent.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.orderTrackingEvent.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.review.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.riskScore.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.terminalEvent.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.driverAccessToken.deleteMany({ where: { orderId: { in: orderIds } } });
  await prisma.order.deleteMany({ where: { id: { in: orderIds } } });

  return orderIds.length;
}

async function main() {
  const since = startOfTodayUtc();
  const candidates = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      OR: [
        { customerName: { contains: "Test", mode: "insensitive" } },
        { customerName: { contains: "Terminal Test", mode: "insensitive" } },
        { notes: { contains: "TEST", mode: "insensitive" } },
        { notes: { contains: "stornieren", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      branchId: true,
      customerName: true,
      notes: true,
      status: true,
      fulfillmentType: true,
      orderTotal: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const testOrders = candidates.filter(isTestOrder);

  if (testOrders.length === 0) {
    console.log("No test orders found for today (since", since.toISOString(), ")");
    return;
  }

  console.log(`Found ${testOrders.length} test order(s) since ${since.toISOString()}:\n`);
  for (const o of testOrders) {
    console.log(
      `- ${o.id.slice(0, 8)}… | ${o.branchId} | ${o.customerName ?? "(no name)"} | ${o.fulfillmentType} | ${o.status} | €${o.orderTotal ?? "?"} | ${o.createdAt.toISOString()}`
    );
    if (o.notes) console.log(`  notes: ${o.notes.slice(0, 120)}`);
  }

  if (!confirm) {
    console.log("\nDry run only. Re-run with --confirm to delete.");
    return;
  }

  const deleted = await deleteOrders(testOrders.map((o) => o.id));
  console.log(`\nDeleted ${deleted} test order(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
