import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Set it in environment or .env before running this script.");
  process.exit(1);
}
const prisma = new PrismaClient();
const orderId = "a31e9f96-275a-4099-b402-c2074415e735";

async function main() {
  await prisma.orderTrackingEvent.create({
    data: {
      id: randomUUID(),
      orderId,
      status: "accepted",
      timestamp: new Date()
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
