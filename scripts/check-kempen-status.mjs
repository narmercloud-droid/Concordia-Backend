import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const branchId = "concordia-kempen";

try {
  const config = await prisma.branchConfig.findUnique({ where: { branchId } });
  const hours = await prisma.branchHours.findMany({
    where: { branchId },
    orderBy: { dayOfWeek: "asc" }
  });
  const json = config?.configJson ?? {};
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  console.log(
    JSON.stringify(
      {
        ordersPaused: Boolean(json.ordersPaused),
        status: json.status ?? "live",
        berlinNow: new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
        hours: hours.map((h) => ({
          day: days[h.dayOfWeek],
          open: h.openTime,
          close: h.closeTime
        }))
      },
      null,
      2
    )
  );
} finally {
  await prisma.$disconnect();
}
