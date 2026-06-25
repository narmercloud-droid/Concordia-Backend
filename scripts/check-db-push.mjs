import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const count = await prisma.webPushSubscription.count();
  const orderCount = await prisma.order.count();
  console.log("WebPushSubscription rows:", count);
  console.log("Total orders:", orderCount);
} catch (err) {
  console.error("FAILED:", err.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
