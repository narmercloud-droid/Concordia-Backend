import { prisma } from "../../prisma/client.js";
import crypto from "crypto";
export async function assignPrinterToFleet(branchId, printerId, group) {
    return prisma.printerFleet.upsert({
        where: {
            branchId_printerId: { branchId, printerId }
        },
        update: { group },
        create: { branchId, printerId, group }
    });
}
export async function updatePrinterPolicy(branchId, printerId, policy) {
    return prisma.printerFleet.update({
        where: {
            branchId_printerId: { branchId, printerId }
        },
        data: { policy }
    });
}
export async function updatePrinterFirmware(branchId, printerId, version) {
    return prisma.printerFleet.update({
        where: {
            branchId_printerId: { branchId, printerId }
        },
        data: { firmware: version }
    });
}
export async function updatePrinterConfigHash(branchId, printerId, config) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(config)).digest("hex");
    return prisma.printerFleet.update({
        where: {
            branchId_printerId: { branchId, printerId }
        },
        data: { configHash: hash }
    });
}
export async function getFleet(branchId) {
    return prisma.printerFleet.findMany({
        where: { branchId },
        orderBy: { group: "asc" }
    });
}
