import { PrismaClient } from "@prisma/client";
import { getBerlinDayOfWeek, getBerlinTimeString, isWithinBranchHours } from "../dist/utils/berlinTime.js";

const prisma = new PrismaClient();
const branchId = "concordia-straelen";
const now = new Date();
const day = getBerlinDayOfWeek(now);
const time = getBerlinTimeString(now);

const hours = await prisma.branchHours.findMany({
  where: { branchId },
  orderBy: { dayOfWeek: "asc" }
});

console.log("Berlin now:", now.toISOString(), "day", day, "time", time);
for (const h of hours) {
  const open = isWithinBranchHours(h.openTime, h.closeTime, time);
  console.log(`  day ${h.dayOfWeek}: ${h.openTime}-${h.closeTime} ${day === h.dayOfWeek ? (open ? "OPEN" : "CLOSED") : ""}`);
}

const cfg = await prisma.branchConfig.findUnique({ where: { branchId: "concordia-kempen" } });
console.log("\nKempen DB status:", cfg?.configJson?.status);

await prisma.$disconnect();
