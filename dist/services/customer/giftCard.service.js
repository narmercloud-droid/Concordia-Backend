import { randomBytes, randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
import logger from "../../logger.js";
import { sendGiftCardConfirmationEmail } from "./orderConfirmationEmail.service.js";
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 500;
const DEFAULT_EXPIRY_YEARS = 3;
function branchCodePrefix(branchId) {
    const slug = branchId.replace(/^concordia-/, "").replace(/[^a-z0-9]/gi, "");
    return slug.slice(0, 6).toUpperCase() || "GIFT";
}
export function generateGiftCardCode(branchId) {
    const token = randomBytes(4).toString("hex").toUpperCase();
    return `GC-${branchCodePrefix(branchId)}-${token.slice(0, 4)}-${token.slice(4, 8)}`;
}
function normalizeAmount(amount) {
    const value = Math.round(amount * 100) / 100;
    if (!Number.isFinite(value) || value < MIN_AMOUNT || value > MAX_AMOUNT) {
        throw new Error(`Gutscheinwert muss zwischen ${MIN_AMOUNT} € und ${MAX_AMOUNT} € liegen`);
    }
    return value;
}
export async function createGiftCardPurchase(input) {
    const amount = normalizeAmount(input.amount);
    if (!input.termsAccepted) {
        throw new Error("Bitte AGB und Widerrufsbelehrung akzeptieren");
    }
    const branch = await prisma.branch.findUnique({ where: { id: input.branchId } });
    if (!branch)
        throw new Error("Filiale nicht gefunden");
    const method = input.paymentMethod.toLowerCase();
    const payOnline = method === "card" ||
        method === "paypal" ||
        method === "apple_pay" ||
        method === "google_pay";
    const code = generateGiftCardCode(input.branchId);
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + DEFAULT_EXPIRY_YEARS);
    const card = await prisma.branchGiftCard.create({
        data: {
            id: randomUUID(),
            branchId: input.branchId,
            code,
            initialAmount: amount,
            balance: payOnline ? 0 : 0,
            purchaserName: input.purchaserName.trim(),
            purchaserEmail: input.purchaserEmail?.trim() || null,
            purchaserPhone: input.purchaserPhone?.trim() || null,
            recipientName: input.recipientName?.trim() || null,
            message: input.message?.trim() || null,
            paymentMethod: method,
            paymentStatus: payOnline ? "pending" : "pending_cash",
            isActive: false,
            termsAcceptedAt: new Date(),
            expiresAt
        }
    });
    return {
        purchaseId: card.id,
        code: null,
        amount,
        branchId: card.branchId,
        paymentRequired: payOnline,
        payAtBranch: method === "cash",
        paymentMethod: method
    };
}
export async function validateGiftCard(branchId, code, orderTotal) {
    const normalized = code.trim().toUpperCase();
    if (!normalized)
        throw new Error("Bitte Gutscheincode eingeben");
    const card = await prisma.branchGiftCard.findFirst({
        where: { code: { equals: normalized, mode: "insensitive" } }
    });
    if (!card)
        throw new Error("Gutscheincode ungültig");
    if (card.branchId !== branchId) {
        throw new Error("Dieser Gutschein gilt nur für die Filiale, in der er gekauft wurde");
    }
    if (card.paymentStatus !== "paid" || !card.isActive) {
        throw new Error("Gutschein ist noch nicht aktiv oder wurde deaktiviert");
    }
    if (card.expiresAt && card.expiresAt < new Date()) {
        throw new Error("Gutschein abgelaufen");
    }
    const balance = Number(card.balance);
    if (balance <= 0)
        throw new Error("Gutschein ist aufgebraucht");
    const discountAmount = Math.min(orderTotal, balance);
    if (discountAmount <= 0) {
        throw new Error("Gutschein kann auf diese Bestellung nicht angewendet werden");
    }
    return {
        code: card.code,
        kind: "gift",
        discountAmount,
        giftCardId: card.id,
        balanceRemaining: Math.round((balance - discountAmount) * 100) / 100
    };
}
export async function redeemGiftCard(giftCardId, amount) {
    const card = await prisma.branchGiftCard.findUnique({ where: { id: giftCardId } });
    if (!card)
        throw new Error("Gutschein nicht gefunden");
    const balance = Number(card.balance);
    if (amount > balance)
        throw new Error("Gutscheinsaldo reicht nicht aus");
    const nextBalance = Math.round((balance - amount) * 100) / 100;
    await prisma.branchGiftCard.update({
        where: { id: giftCardId },
        data: {
            balance: nextBalance,
            isActive: nextBalance > 0
        }
    });
}
export async function activateGiftCardAfterPayment(purchaseId, transactionId) {
    const card = await prisma.branchGiftCard.findUnique({ where: { id: purchaseId } });
    if (!card)
        throw new Error("Gutscheinkauf nicht gefunden");
    if (card.paymentStatus === "paid") {
        return { code: card.code, alreadyPaid: true };
    }
    const paymentData = {
        paymentStatus: "paid",
        isActive: true,
        balance: card.initialAmount
    };
    if (transactionId?.startsWith("pi_")) {
        paymentData.stripePaymentIntentId = transactionId;
    }
    else if (transactionId) {
        paymentData.paypalCaptureId = transactionId;
    }
    const updated = await prisma.branchGiftCard.update({
        where: { id: purchaseId },
        data: paymentData
    });
    if (!card.paymentStatus || card.paymentStatus !== "paid") {
        void sendGiftCardConfirmationEmail(purchaseId).catch((err) => {
            logger.warn({ err, purchaseId }, "Gift card confirmation email failed");
        });
    }
    return { code: updated.code, alreadyPaid: false };
}
export async function getGiftCardPurchase(purchaseId) {
    return prisma.branchGiftCard.findUnique({ where: { id: purchaseId } });
}
