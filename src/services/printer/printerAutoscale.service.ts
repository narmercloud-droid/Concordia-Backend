import { prisma } from "../../prisma/client.ts";
import { kitchenPrinters } from "../../config/printers.ts";
import logger from "../../logger.ts";

export async function scaleUp(kitchen) {
  const instanceId = "vp-" + Math.random().toString(36).substring(2, 10);

  await prisma.virtualPrinter.create({
    data: {
      kitchen,
      instanceId
    }
  });

  kitchenPrinters[kitchen].push({
    id: instanceId,
    type: "virtual",
    host: "127.0.0.1",
    port: 9999,
    status: {
      online: true,
      lastCheck: new Date(),
      lastSuccess: new Date(),
      lastError: null
    }
  });

  logger.info({ instanceId, kitchen }, "Scaled UP virtual printer");
}

export async function scaleDown(kitchen) {
  const vp = await prisma.virtualPrinter.findFirst({
    where: { kitchen, active: true },
    orderBy: { createdAt: "desc" }
  });

  if (!vp) return;

  await prisma.virtualPrinter.update({
    where: { id: vp.id },
    data: { active: false, releasedAt: new Date() }
  });

  const idx = kitchenPrinters[kitchen].findIndex(p => p.id === vp.instanceId);
  if (idx !== -1) kitchenPrinters[kitchen].splice(idx, 1);

  logger.info({ instanceId: vp.instanceId, kitchen }, "Scaled DOWN virtual printer");
}

