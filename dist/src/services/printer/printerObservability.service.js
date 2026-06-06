import { prisma } from "../../prisma/client.js";
export async function recordTrace(printer, event, durationMs = null) {
    return prisma.printerTrace.create({
        data: {
            printerId: printer.id,
            kitchen: printer.kitchen || "B",
            branchId: "branch-001",
            event,
            durationMs
        }
    });
}
export async function updateHealth(printer, delta) {
    const existing = await prisma.printerHealth.findFirst({
        where: { printerId: printer.id }
    });
    if (!existing) {
        return prisma.printerHealth.create({
            data: {
                printerId: printer.id,
                branchId: "branch-001",
                score: 100 + delta
            }
        });
    }
    return prisma.printerHealth.update({
        where: { id: existing.id },
        data: {
            score: Math.max(0, Math.min(100, existing.score + delta)),
            lastUpdated: new Date()
        }
    });
}
export async function recordAnomaly(printer, type, severity) {
    return prisma.printerAnomaly.create({
        data: {
            printerId: printer.id,
            branchId: "branch-001",
            type,
            severity
        }
    });
}
