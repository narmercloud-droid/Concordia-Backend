import { prisma } from "../../prisma/client.js";
import { kitchenPrinters } from "../../config/printers.js";

export async function syncPrintersToCloud(branchId) {
  const all = [];

  Object.keys(kitchenPrinters).forEach(k => {
    kitchenPrinters[k].forEach(p => {
      all.push({
        branchId,
        printerId: p.id,
        kitchen: k,
        ipAddress: p.host,
        type: p.type,
        online: p.status.online
      });
    });
  });

  for (const p of all) {
    await prisma.cloudPrinter.upsert({
      where: {
        branchId_printerId: {
          branchId: p.branchId,
          printerId: p.printerId
        }
      },
      update: {
        ipAddress: p.ipAddress,
        type: p.type,
        kitchen: p.kitchen,
        online: p.online,
        lastSync: new Date()
      },
      create: {
        branchId: p.branchId,
        printerId: p.printerId,
        ipAddress: p.ipAddress,
        type: p.type,
        kitchen: p.kitchen,
        online: p.online
      }
    });
  }
}

export async function getCloudPrinters() {
  return prisma.cloudPrinter.findMany({
    orderBy: { branchId: "asc" }
  });
}

