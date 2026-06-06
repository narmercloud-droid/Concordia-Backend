import { prisma } from "../../prisma/client.js";
import crypto from "crypto";
export function generatePrinterToken() {
    return crypto.randomBytes(16).toString("hex");
}
export async function registerPrinter(printer) {
    const token = generatePrinterToken();
    return prisma.printerSecurity.create({
        data: {
            printerId: printer.id,
            kitchen: "B",
            ipAddress: printer.host,
            token
        }
    });
}
export async function approvePrinter(id) {
    return prisma.printerSecurity.update({
        where: { id },
        data: { approved: true }
    });
}
export async function verifyPrinter(printer) {
    const record = await prisma.printerSecurity.findFirst({
        where: {
            printerId: printer.id,
            ipAddress: printer.host
        }
    });
    if (!record)
        return false;
    if (!record.approved)
        return false;
    return true;
}
export async function markTampered(printer) {
    return prisma.printerSecurity.updateMany({
        where: { printerId: printer.id },
        data: { tampered: true, trustScore: { decrement: 20 } }
    });
}
