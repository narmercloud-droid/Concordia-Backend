import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const branchId = "concordia-kempen";

const orders = await prisma.order.findMany({
  where: {
    branchId,
    createdAt: {
      gte: new Date("2026-07-03T00:00:00+02:00"),
      lt: new Date("2026-07-04T00:00:00+02:00")
    }
  },
  orderBy: { createdAt: "asc" },
  select: {
    id: true,
    createdAt: true,
    customerName: true,
    customerPhone: true,
    orderTotal: true,
    paymentStatus: true,
    paymentMethod: true,
    status: true,
    fulfillmentType: true,
    paypalOrderId: true,
    paypalCaptureId: true
  }
});

for (const o of orders) {
  console.log(
    [
      o.createdAt.toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
      o.id,
      `€${Number(o.orderTotal ?? 0).toFixed(2)}`,
      o.paymentStatus ?? "-",
      o.paymentMethod ?? "-",
      o.status,
      o.customerName ?? "-",
      o.customerPhone ?? "-"
    ].join(" | ")
  );
}

console.log(`\nTotal: ${orders.length} order(s) today (Kempen, Europe/Berlin)`);

await prisma.$disconnect();
