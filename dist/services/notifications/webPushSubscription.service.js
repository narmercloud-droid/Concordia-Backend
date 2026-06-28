import { prisma } from "../../prisma/client.js";
import logger from "../../logger.js";
import { sendPush } from "./notification.service.js";
export function parsePushToken(raw) {
    if (!raw)
        return null;
    let parsed = raw;
    if (typeof raw === "string") {
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    const endpoint = String(parsed?.endpoint ?? "").trim();
    const p256dh = String(parsed?.keys?.p256dh ?? "").trim();
    const auth = String(parsed?.keys?.auth ?? "").trim();
    if (!endpoint || !p256dh || !auth)
        return null;
    return { endpoint, keys: { p256dh, auth } };
}
export async function upsertWebPushSubscription(input) {
    const parsed = parsePushToken(input.token);
    if (!parsed) {
        throw new Error("Invalid push subscription");
    }
    return prisma.webPushSubscription.upsert({
        where: { endpoint: parsed.endpoint },
        create: {
            endpoint: parsed.endpoint,
            p256dh: parsed.keys.p256dh,
            auth: parsed.keys.auth,
            customerId: input.customerId ?? null,
            allowOffers: input.allowOffers ?? true,
            allowOrders: input.allowOrders ?? true,
            branchId: input.branchId ?? null
        },
        update: {
            p256dh: parsed.keys.p256dh,
            auth: parsed.keys.auth,
            ...(input.customerId ? { customerId: input.customerId } : {}),
            ...(typeof input.allowOffers === "boolean" ? { allowOffers: input.allowOffers } : {}),
            ...(typeof input.allowOrders === "boolean" ? { allowOrders: input.allowOrders } : {}),
            ...(input.branchId ? { branchId: input.branchId } : {})
        }
    });
}
export async function removeWebPushSubscription(token) {
    const parsed = parsePushToken(token);
    if (!parsed)
        return false;
    await prisma.webPushSubscription.deleteMany({
        where: { endpoint: parsed.endpoint }
    });
    return true;
}
export async function persistPushSubscriptionFromOrder(input) {
    let customerId = input.customerId ?? null;
    if (!customerId && input.customerEmail) {
        const customer = await prisma.customer.findUnique({
            where: { email: input.customerEmail.trim().toLowerCase() },
            select: { id: true }
        });
        customerId = customer?.id ?? null;
    }
    await upsertWebPushSubscription({
        token: input.token,
        customerId,
        branchId: input.branchId,
        allowOffers: input.allowOffers,
        allowOrders: true
    });
}
function subscriptionPayload(row) {
    return {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth }
    };
}
export async function sendOfferPushToCustomerEmail(email, title, body, url) {
    if (!email?.trim())
        return { sent: 0 };
    const customer = await prisma.customer.findUnique({
        where: { email: email.trim().toLowerCase() },
        select: { id: true }
    });
    if (!customer)
        return { sent: 0 };
    return sendOfferPushToCustomerId(customer.id, title, body, url);
}
export async function sendOfferPushToCustomerId(customerId, title, body, url) {
    const subs = await prisma.webPushSubscription.findMany({
        where: { customerId, allowOffers: true }
    });
    let sent = 0;
    for (const sub of subs) {
        try {
            await sendPush(subscriptionPayload(sub), title, body, { url, kind: "offer" });
            sent++;
        }
        catch (err) {
            if (err?.statusCode === 404 || err?.statusCode === 410) {
                await prisma.webPushSubscription.delete({ where: { id: sub.id } }).catch(() => undefined);
            }
            logger.warn({ err, endpoint: sub.endpoint }, "Offer push failed");
        }
    }
    return { sent };
}
export async function broadcastOfferPush(input) {
    const subs = await prisma.webPushSubscription.findMany({
        where: {
            allowOffers: true,
            ...(input.branchId ? { OR: [{ branchId: input.branchId }, { branchId: null }] } : {})
        }
    });
    let sent = 0;
    for (const sub of subs) {
        try {
            await sendPush(subscriptionPayload(sub), input.title, input.body, {
                url: input.url,
                kind: "offer"
            });
            sent++;
        }
        catch (err) {
            if (err?.statusCode === 404 || err?.statusCode === 410) {
                await prisma.webPushSubscription.delete({ where: { id: sub.id } }).catch(() => undefined);
            }
        }
    }
    logger.info({ sent, total: subs.length, branchId: input.branchId }, "Offer push broadcast");
    return { sent, total: subs.length };
}
