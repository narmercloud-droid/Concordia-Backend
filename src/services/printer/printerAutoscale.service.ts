import { prisma } from "../../prisma/client.js";
import { kitchenPrinters } from "../../config/printers.js";

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

  console.log("Scaled UP virtual printer:", instanceId);
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

  console.log("Scaled DOWN virtual printer:", vp.instanceId);
}

