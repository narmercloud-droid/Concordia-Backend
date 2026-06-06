import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Set it in environment or .env before running this script.");
  process.exit(1);
}
const prisma = new PrismaClient();

async function main() {
  const orderId = "a31e9f96-275a-4099-b402-c2074415e735";
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, tracking_token: true, createdAt: true, updatedAt: true }
  });

  console.log("order", order);

  const timeline = await prisma.orderTrackingEvent.findMany({
    where: { orderId },
    orderBy: { timestamp: "asc" }
  });

  console.log(`timeline (${timeline.length})`);
  for (const event of timeline) {
    console.log(event);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
