/**
 * Delete orders created before a Berlin calendar date (exclusive).
 *
 * Usage:
 *   node scripts/purge-orders-before.mjs 2026-06-24
 *
 * Deletes all orders with createdAt before 2026-06-24 00:00 Europe/Berlin (both branches).
 */
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { berlinDayStartUtc } from "../dist/utils/berlinTime.js";
import { deleteOrderCompletely } from "../dist/services/order/orderDeletion.service.js";
import { reconcileAllBranchCustomers } from "../dist/services/customer/branchCustomer.service.js";

dotenv.config();

const prisma = new PrismaClient();
const cutoffYmd = process.argv[2]?.trim();

if (!cutoffYmd || !/^\d{4}-\d{2}-\d{2}$/.test(cutoffYmd)) {
  console.error("Usage: node scripts/purge-orders-before.mjs YYYY-MM-DD");
  console.error("Example: node scripts/purge-orders-before.mjs 2026-06-24");
  process.exit(1);
}

const cutoff = berlinDayStartUtc(cutoffYmd);

async function main() {
  const orders = await prisma.order.findMany({
    where: { createdAt: { lt: cutoff } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      branchId: true,
      createdAt: true,
      customerName: true,
      orderTotal: true,
      paymentStatus: true,
      status: true
    }
  });

  console.log(`Cutoff: before ${cutoffYmd} 00:00 Berlin (${cutoff.toISOString()})`);
  console.log(`Found ${orders.length} order(s) to delete\n`);

  for (const order of orders) {
    console.log(
      `${order.createdAt.toLocaleString("de-DE", { timeZone: "Europe/Berlin" })} | ${order.branchId} | ${order.id.slice(0, 8)}… | ${order.customerName ?? "-"} | €${Number(order.orderTotal ?? 0).toFixed(2)} | ${order.paymentStatus} | ${order.status}`
    );
  }

  if (!orders.length) {
    return;
  }

  for (const order of orders) {
    await deleteOrderCompletely(order.id);
  }

  const reconciled = await reconcileAllBranchCustomers();
  console.log(`\nDeleted ${orders.length} order(s).`);
  console.log(`Reconciled ${reconciled.updated} branch customer record(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
