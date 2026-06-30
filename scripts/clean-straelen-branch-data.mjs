/**
 * Remove all orders and branch customer records for Straelen.
 * Deletes registered Customer accounts that only ever ordered at Straelen.
 *
 * Usage: node scripts/clean-straelen-branch-data.mjs [--confirm]
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const BRANCH_ID = "concordia-straelen";
const prisma = new PrismaClient();

async function deleteOrdersForBranch(branchId) {
  const orders = await prisma.order.findMany({
    where: { branchId },
    select: { id: true, customerId: true }
  });
  const orderIds = orders.map((o) => o.id);
  const customerIds = [
    ...new Set(orders.map((o) => o.customerId).filter(Boolean))
  ];

  if (orderIds.length === 0) {
    return { orderCount: 0, customerIds };
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: { in: orderIds } },
    select: { id: true }
  });
  const orderItemIds = orderItems.map((i) => i.id);

  if (orderItemIds.length > 0) {
    await prisma.orderItemExtra.deleteMany({
      where: { orderItemId: { in: orderItemIds } }
    });
    await prisma.orderItemVariant.deleteMany({
      where: { orderItemId: { in: orderItemIds } }
    });
    await prisma.itemRating.deleteMany({
      where: { orderItemId: { in: orderItemIds } }
    });
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

  return { orderCount: orderIds.length, customerIds };
}

async function deleteCustomerFully(customerId) {
  await prisma.customerSession.deleteMany({ where: { customerId } });
  await prisma.address.deleteMany({ where: { customerId } });
  await prisma.favorite.deleteMany({ where: { customerId } });
  await prisma.loyaltyPoints.deleteMany({ where: { customerId } });
  await prisma.notificationPreference.deleteMany({ where: { customerId } });
  await prisma.referral.deleteMany({ where: { customerId } });
  await prisma.userReward.deleteMany({ where: { customerId } });
  await prisma.customerCoupon.deleteMany({ where: { customerId } });
  await prisma.customerBranchStripe.deleteMany({ where: { customerId } });
  await prisma.review.deleteMany({ where: { customerId } });
  await prisma.orderIssue.deleteMany({ where: { customerId } });

  const wallet = await prisma.wallet.findUnique({ where: { customerId } });
  if (wallet) {
    await prisma.walletTransaction.deleteMany({ where: { walletId: wallet.id } });
    await prisma.wallet.delete({ where: { id: wallet.id } });
  }

  await prisma.webPushSubscription.updateMany({
    where: { customerId },
    data: { customerId: null }
  });

  await prisma.customer.delete({ where: { id: customerId } });
}

async function main() {
  const confirm = process.argv.includes("--confirm");
  if (!confirm) {
    console.error("Pass --confirm to delete Straelen orders and customers.");
    process.exit(1);
  }

  const branch = await prisma.branch.findUnique({ where: { id: BRANCH_ID } });
  if (!branch) {
    throw new Error(`Branch not found: ${BRANCH_ID}`);
  }

  console.log(`Cleaning ${branch.name} (${BRANCH_ID})…`);

  const { orderCount, customerIds } = await deleteOrdersForBranch(BRANCH_ID);
  console.log(`  removed ${orderCount} order(s)`);

  const branchCustomers = await prisma.branchCustomer.deleteMany({
    where: { branchId: BRANCH_ID }
  });
  console.log(`  removed ${branchCustomers.count} branch customer record(s)`);

  let removedCustomers = 0;
  for (const customerId of customerIds) {
    const remainingOrders = await prisma.order.count({ where: { customerId } });
    if (remainingOrders > 0) continue;
    await deleteCustomerFully(customerId);
    removedCustomers += 1;
  }
  console.log(`  removed ${removedCustomers} registered customer account(s) (Straelen-only)`);

  const remainingOrders = await prisma.order.count({ where: { branchId: BRANCH_ID } });
  const remainingBranchCustomers = await prisma.branchCustomer.count({
    where: { branchId: BRANCH_ID }
  });

  console.log(
    `\nDone. Remaining orders: ${remainingOrders}, branch customers: ${remainingBranchCustomers}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
