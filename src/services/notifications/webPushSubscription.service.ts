import { prisma } from "../../prisma/client.ts";
import logger from "../../logger.ts";
import { sendPush } from "./notification.service.js";

export type ParsedPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export function parsePushToken(raw: unknown): ParsedPushSubscription | null {
  if (!raw) return null;

  let parsed: any = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const endpoint = String(parsed?.endpoint ?? "").trim();
  const p256dh = String(parsed?.keys?.p256dh ?? "").trim();
  const auth = String(parsed?.keys?.auth ?? "").trim();
  if (!endpoint || !p256dh || !auth) return null;

  return { endpoint, keys: { p256dh, auth } };
}

export async function upsertWebPushSubscription(input: {
  token: unknown;
  customerId?: string | null;
  allowOffers?: boolean;
  allowOrders?: boolean;
  branchId?: string | null;
}) {
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

export async function removeWebPushSubscription(token: unknown) {
  const parsed = parsePushToken(token);
  if (!parsed) return false;

  await prisma.webPushSubscription.deleteMany({
    where: { endpoint: parsed.endpoint }
  });
  return true;
}

export async function persistPushSubscriptionFromOrder(input: {
  token: string;
  customerId?: string | null;
  branchId: string;
  allowOffers?: boolean;
  customerEmail?: string | null;
}) {
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

function subscriptionPayload(row: {
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  return {
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth }
  };
}

export async function sendOfferPushToCustomerEmail(
  email: string | null | undefined,
  title: string,
  body: string,
  url: string
) {
  if (!email?.trim()) return { sent: 0 };

  const customer = await prisma.customer.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true }
  });
  if (!customer) return { sent: 0 };

  return sendOfferPushToCustomerId(customer.id, title, body, url);
}

export async function sendOfferPushToCustomerId(
  customerId: string,
  title: string,
  body: string,
  url: string
) {
  const subs = await prisma.webPushSubscription.findMany({
    where: { customerId, allowOffers: true }
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await sendPush(subscriptionPayload(sub), title, body, { url, kind: "offer" });
      sent++;
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await prisma.webPushSubscription.delete({ where: { id: sub.id } }).catch(() => undefined);
      }
      logger.warn({ err, endpoint: sub.endpoint }, "Offer push failed");
    }
  }

  return { sent };
}

export async function broadcastOfferPush(input: {
  title: string;
  body: string;
  url: string;
  branchId?: string | null;
}) {
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
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await prisma.webPushSubscription.delete({ where: { id: sub.id } }).catch(() => undefined);
      }
    }
  }

  logger.info({ sent, total: subs.length, branchId: input.branchId }, "Offer push broadcast");
  return { sent, total: subs.length };
}
