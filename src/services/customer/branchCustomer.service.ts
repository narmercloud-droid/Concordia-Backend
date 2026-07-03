import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";

export type PreferredChannel = "whatsapp" | "sms" | "email";

export type BranchCustomerInput = {
  branchId: string;
  phone: string;
  name?: string;
  email?: string | null;
  birthday?: string | Date | null;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
  marketingWhatsApp?: boolean;
  orderTotal?: number;
  savedAmount?: number;
};

export function resolvePreferredChannel(input: {
  marketingWhatsApp?: boolean;
  marketingSMS?: boolean;
  marketingEmail?: boolean;
}): PreferredChannel | null {
  if (input.marketingWhatsApp) return "whatsapp";
  if (input.marketingSMS) return "sms";
  if (input.marketingEmail) return "email";
  return null;
}

function parseBirthday(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function syncBranchCustomerFromOrder(input: BranchCustomerInput) {
  const phone = input.phone.trim();
  const branchId = input.branchId;
  if (!phone || !branchId) return null;

  const now = new Date();
  const hasMarketing =
    Boolean(input.marketingEmail) ||
    Boolean(input.marketingSMS) ||
    Boolean(input.marketingWhatsApp);
  const preferredChannel = hasMarketing
    ? resolvePreferredChannel(input)
    : null;
  const birthday = parseBirthday(input.birthday);
  const orderTotal = Math.max(0, Number(input.orderTotal ?? 0));
  const savedAmount = Math.max(0, Number(input.savedAmount ?? 0));

  const existing = await prisma.branchCustomer.findUnique({
    where: { branchId_phone: { branchId, phone } }
  });

  if (existing) {
    return prisma.branchCustomer.update({
      where: { branchId_phone: { branchId, phone } },
      data: {
        name: input.name?.trim() || existing.name,
        email: input.email?.trim() || existing.email,
        birthday: birthday ?? existing.birthday,
        marketingEmail: input.marketingEmail || existing.marketingEmail,
        marketingSMS: input.marketingSMS || existing.marketingSMS,
        marketingWhatsApp: input.marketingWhatsApp || existing.marketingWhatsApp,
        preferredChannel: preferredChannel ?? existing.preferredChannel,
        consentAt:
          hasMarketing && !existing.consentAt ? now : existing.consentAt,
        orderCount: { increment: 1 },
        totalSpent: { increment: orderTotal },
        totalSaved: { increment: savedAmount },
        firstOrderAt: existing.firstOrderAt ?? now,
        lastOrderAt: now
      }
    });
  }

  return prisma.branchCustomer.create({
    data: {
      id: randomUUID(),
      branchId,
      phone,
      name: input.name?.trim() || null,
      email: input.email?.trim() || null,
      birthday,
      marketingEmail: Boolean(input.marketingEmail),
      marketingSMS: Boolean(input.marketingSMS),
      marketingWhatsApp: Boolean(input.marketingWhatsApp),
      preferredChannel,
      consentAt: hasMarketing ? now : null,
      orderCount: 1,
      totalSpent: orderTotal,
      totalSaved: savedAmount,
      firstOrderAt: now,
      lastOrderAt: now
    }
  });
}

export async function listBranchCustomers(
  branchId: string,
  options?: { marketingOnly?: boolean; search?: string }
) {
  const search = options?.search?.trim();
  return prisma.branchCustomer.findMany({
    where: {
      branchId,
      ...(options?.marketingOnly
        ? {
            OR: [
              { marketingEmail: true },
              { marketingSMS: true },
              { marketingWhatsApp: true }
            ]
          }
        : {}),
      ...(search
        ? {
            OR: [
              { phone: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { lastOrderAt: "desc" }
  });
}

export async function getBranchCustomerStats(branchId: string) {
  const [total, marketingOptIn, repeatCustomers, aggregates] = await Promise.all([
    prisma.branchCustomer.count({ where: { branchId } }),
    prisma.branchCustomer.count({
      where: {
        branchId,
        OR: [
          { marketingEmail: true },
          { marketingSMS: true },
          { marketingWhatsApp: true }
        ]
      }
    }),
    prisma.branchCustomer.count({
      where: { branchId, orderCount: { gte: 3 } }
    }),
    prisma.branchCustomer.aggregate({
      where: { branchId },
      _sum: { totalSpent: true, totalSaved: true, orderCount: true }
    })
  ]);

  return {
    total,
    marketingOptIn,
    repeatCustomers,
    totalOrders: aggregates._sum.orderCount ?? 0,
    totalSpent: aggregates._sum.totalSpent ?? 0,
    totalSaved: aggregates._sum.totalSaved ?? 0
  };
}

export async function recalculateBranchCustomerStats(branchId: string, phone: string) {
  const normalizedPhone = phone.trim();
  if (!normalizedPhone) return null;

  const orders = await prisma.order.findMany({
    where: { branchId, customerPhone: normalizedPhone },
    select: {
      orderTotal: true,
      discount: true,
      giftCardAmount: true,
      createdAt: true
    },
    orderBy: { createdAt: "asc" }
  });

  const existing = await prisma.branchCustomer.findUnique({
    where: { branchId_phone: { branchId, phone: normalizedPhone } }
  });

  if (!orders.length) {
    if (!existing) return null;
    return prisma.branchCustomer.update({
      where: { branchId_phone: { branchId, phone: normalizedPhone } },
      data: {
        orderCount: 0,
        totalSpent: 0,
        totalSaved: 0,
        firstOrderAt: null,
        lastOrderAt: null
      }
    });
  }

  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.orderTotal ?? 0), 0);
  const totalSaved = orders.reduce(
    (sum, o) => sum + Number(o.discount ?? 0) + Number(o.giftCardAmount ?? 0),
    0
  );
  const firstOrderAt = orders[0]!.createdAt;
  const lastOrderAt = orders[orders.length - 1]!.createdAt;

  if (!existing) {
    return prisma.branchCustomer.create({
      data: {
        id: randomUUID(),
        branchId,
        phone: normalizedPhone,
        orderCount,
        totalSpent,
        totalSaved,
        firstOrderAt,
        lastOrderAt
      }
    });
  }

  return prisma.branchCustomer.update({
    where: { branchId_phone: { branchId, phone: normalizedPhone } },
    data: {
      orderCount,
      totalSpent,
      totalSaved,
      firstOrderAt,
      lastOrderAt
    }
  });
}

export async function reconcileAllBranchCustomers(branchId?: string) {
  const customers = await prisma.branchCustomer.findMany({
    where: branchId ? { branchId } : {},
    select: { branchId: true, phone: true }
  });

  for (const customer of customers) {
    await recalculateBranchCustomerStats(customer.branchId, customer.phone);
  }

  return { updated: customers.length };
}

export async function getCustomerOrderHistory(branchId: string, phone: string) {
  return prisma.order.findMany({
    where: { branchId, customerPhone: phone },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      items: { include: { item: true } }
    }
  });
}

export function branchCustomersToCsv(
  customers: Awaited<ReturnType<typeof listBranchCustomers>>
) {
  const header = [
    "phone",
    "name",
    "email",
    "birthday",
    "orderCount",
    "totalSpent",
    "totalSaved",
    "lastOrderAt",
    "preferredChannel",
    "marketingEmail",
    "marketingSMS",
    "marketingWhatsApp"
  ].join(",");

  const rows = customers.map((c) =>
    [
      c.phone,
      csvEscape(c.name ?? ""),
      csvEscape(c.email ?? ""),
      c.birthday ? c.birthday.toISOString().slice(0, 10) : "",
      c.orderCount,
      (c.totalSpent ?? 0).toFixed(2),
      (c.totalSaved ?? 0).toFixed(2),
      c.lastOrderAt?.toISOString() ?? "",
      c.preferredChannel ?? "",
      c.marketingEmail,
      c.marketingSMS,
      c.marketingWhatsApp
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function getWinBackCandidates(branchId: string) {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const resendCutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  return prisma.branchCustomer.findMany({
    where: {
      branchId,
      orderCount: { gte: 3 },
      lastOrderAt: { lt: cutoff },
      preferredChannel: { not: null },
      OR: [
        { winBackOfferSentAt: null },
        { winBackOfferSentAt: { lt: resendCutoff } }
      ]
    }
  });
}

export async function getBirthdayCandidates(branchId: string) {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const year = now.getUTCFullYear();
  const sentCutoff = new Date(year, 0, 1);

  const customers = await prisma.branchCustomer.findMany({
    where: {
      branchId,
      birthday: { not: null },
      preferredChannel: { not: null },
      OR: [
        { birthdayOfferSentAt: null },
        { birthdayOfferSentAt: { lt: sentCutoff } }
      ]
    }
  });

  return customers.filter((c) => {
    if (!c.birthday) return false;
    return (
      c.birthday.getUTCMonth() + 1 === month && c.birthday.getUTCDate() === day
    );
  });
}
