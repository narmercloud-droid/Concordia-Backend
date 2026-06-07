/**
 * Remove legacy dev/test branches from the database.
 * Usage: node scripts/delete-test-branch.mjs [branchId...]
 * Default ids: branch-001, test-branch-1
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_IDS = ["branch-001", "test-branch-1"];

async function deleteOrdersForBranch(branchId) {
  const orders = await prisma.order.findMany({
    where: { branchId },
    select: { id: true }
  });
  const orderIds = orders.map((o) => o.id);
  if (orderIds.length === 0) return 0;

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: { in: orderIds } },
    select: { id: true }
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
  await prisma.order.deleteMany({ where: { id: { in: orderIds } } });

  return orderIds.length;
}

async function deleteBranchData(branchId) {
  const existing = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!existing) {
    console.log(`Skip ${branchId} — not found`);
    return;
  }

  console.log(`Deleting ${branchId} (${existing.name})…`);

  const orderCount = await deleteOrdersForBranch(branchId);
  console.log(`  removed ${orderCount} order(s)`);

  await prisma.review.deleteMany({ where: { branchId } });
  await prisma.branchItemAvailability.deleteMany({ where: { branchId } });
  await prisma.branchItemPricing.deleteMany({ where: { branchId } });
  await prisma.branchMenuItem.deleteMany({ where: { branchId } });
  await prisma.branchCategory.deleteMany({ where: { branchId } });
  if (prisma.branchExtraPreset) {
    await prisma.branchExtraPreset.deleteMany({ where: { branchId } });
  }
  await prisma.branchHours.deleteMany({ where: { branchId } });
  await prisma.branchSchedule.deleteMany({ where: { branchId } });
  await prisma.branchTerminal.deleteMany({ where: { branchId } });
  await prisma.activationCode.deleteMany({ where: { branchId } });
  await prisma.device.deleteMany({ where: { branchId } });
  await prisma.driver.deleteMany({ where: { branchId } });
  await prisma.courier.deleteMany({ where: { branchId } });
  await prisma.kitchenDisplay.deleteMany({ where: { branchId } });
  await prisma.terminal.deleteMany({ where: { branchId } });
  await prisma.deliveryZone.deleteMany({ where: { branchId } });
  await prisma.branchCustomer.deleteMany({ where: { branchId } });
  await prisma.branchGiftCard.deleteMany({ where: { branchId } });

  const managers = await prisma.manager.findMany({
    where: { branchId },
    select: { id: true }
  });
  if (managers.length > 0) {
    const managerIds = managers.map((m) => m.id);
    await prisma.managerSession.deleteMany({ where: { managerId: { in: managerIds } } });
    await prisma.manager.deleteMany({ where: { id: { in: managerIds } } });
  }

  await prisma.branchConfig.deleteMany({ where: { branchId } });
  await prisma.branch.delete({ where: { id: branchId } });

  console.log(`  ✓ deleted ${branchId}`);
}

async function main() {
  const ids = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_IDS;

  for (const branchId of ids) {
    await deleteBranchData(branchId);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
