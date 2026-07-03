import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const prisma = new PrismaClient();
const rows = await prisma.order.findMany({
  orderBy: { createdAt: "asc" },
  select: {
    id: true,
    branchId: true,
    createdAt: true,
    customerName: true,
    status: true,
    paymentStatus: true,
    orderTotal: true
  }
});
console.log("Remaining orders:", rows.length);
for (const o of rows) {
  console.log(
    o.createdAt.toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
    o.branchId,
    o.customerName,
    o.status,
    o.paymentStatus,
    `€${Number(o.orderTotal ?? 0).toFixed(2)}`
  );
}
await prisma.$disconnect();
