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

/** Canonical phone key for branch customer records (digits only). */
export function normalizeBranchPhone(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("49") && digits.length >= 11) return `0${digits.slice(2)}`;
  if (digits.startsWith("0049") && digits.length >= 13) return `0${digits.slice(4)}`;
  return digits;
}

export async function upsertRegisteredBranchCustomer(input: {
  branchId: string;
  phone: string;
  name?: string | null;
  email?: string | null;
  marketingEmail?: boolean;
  marketingSMS?: boolean;
  marketingWhatsApp?: boolean;
}) {
  const branchId = input.branchId.trim();
  const phone = normalizeBranchPhone(input.phone);
  if (!branchId || !phone) return null;

  const hasMarketing =
    Boolean(input.marketingEmail) ||
    Boolean(input.marketingSMS) ||
    Boolean(input.marketingWhatsApp);
  const preferredChannel = hasMarketing
    ? resolvePreferredChannel(input)
    : null;

  const existing = await prisma.branchCustomer.findUnique({
    where: { branchId_phone: { branchId, phone } }
  });

  if (existing) {
    return prisma.branchCustomer.update({
      where: { branchId_phone: { branchId, phone } },
      data: {
        name: input.name?.trim() || existing.name,
        email: input.email?.trim() || existing.email,
        marketingEmail: input.marketingEmail || existing.marketingEmail,
        marketingSMS: input.marketingSMS || existing.marketingSMS,
        marketingWhatsApp: input.marketingWhatsApp || existing.marketingWhatsApp,
        preferredChannel: preferredChannel ?? existing.preferredChannel,
        consentAt:
          hasMarketing && !existing.consentAt ? new Date() : existing.consentAt
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
      marketingEmail: Boolean(input.marketingEmail),
      marketingSMS: Boolean(input.marketingSMS),
      marketingWhatsApp: Boolean(input.marketingWhatsApp),
      preferredChannel,
      consentAt: hasMarketing ? new Date() : null,
      orderCount: 0,
      totalSpent: 0,
      totalSaved: 0
    }
  });
}

const COMPLETED_ORDER_STATUSES = ["rejected", "cancelled"] as const;

/** True when this would be the customer's first completed order at the branch. */
export async function isFirstBranchOrder(
  branchId: string,
  phone: string,
  customerId?: string | null
): Promise<boolean> {
  const trimmedPhone = phone.trim();
  const statusFilter = { notIn: [...COMPLETED_ORDER_STATUSES] };

  if (customerId?.trim()) {
    const priorByAccount = await prisma.order.count({
      where: { branchId, customerId: customerId.trim(), status: statusFilter }
    });
    if (priorByAccount > 0) return false;
  }

  if (trimmedPhone) {
    const priorByPhone = await prisma.order.count({
      where: { branchId, customerPhone: trimmedPhone, status: statusFilter }
    });
    if (priorByPhone > 0) return false;
  }

  const normalizedPhone = normalizeBranchPhone(phone);
  if (normalizedPhone) {
    const branchCustomer = await prisma.branchCustomer.findUnique({
      where: { branchId_phone: { branchId, phone: normalizedPhone } }
    });
    if (branchCustomer && branchCustomer.orderCount > 0) return false;
  }

  return true;
}

export async function syncBranchCustomerFromOrder(input: BranchCustomerInput) {
  const phone = normalizeBranchPhone(input.phone);
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
  const normalizedPhone = normalizeBranchPhone(phone);
  if (!normalizedPhone) return null;

  const orders = await prisma.order.findMany({
    where: {
      branchId,
      status: { notIn: ["cancelled", "rejected"] },
      OR: [
        { customerPhone: normalizedPhone },
        { customerPhone: { contains: normalizedPhone.replace(/^0/, ""), mode: "insensitive" } }
      ]
    },
    select: {
      customerPhone: true,
      orderTotal: true,
      discount: true,
      giftCardAmount: true,
      createdAt: true,
      customerName: true,
      customerEmail: true
    },
    orderBy: { createdAt: "asc" }
  });

  const matchingOrders = orders.filter(
    (order) => normalizeBranchPhone(order.customerPhone) === normalizedPhone
  );

  const existing = await prisma.branchCustomer.findUnique({
    where: { branchId_phone: { branchId, phone: normalizedPhone } }
  });

  if (!matchingOrders.length) {
    if (!existing) return null;
    const keepForMarketing =
      existing.marketingEmail || existing.marketingSMS || existing.marketingWhatsApp;
    if (!keepForMarketing) {
      await prisma.branchCustomer.delete({
        where: { branchId_phone: { branchId, phone: normalizedPhone } }
      });
      return { deleted: true, phone: normalizedPhone };
    }
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

  const orderCount = matchingOrders.length;
  const totalSpent = matchingOrders.reduce((sum, o) => sum + Number(o.orderTotal ?? 0), 0);
  const totalSaved = matchingOrders.reduce(
    (sum, o) => sum + Number(o.discount ?? 0) + Number(o.giftCardAmount ?? 0),
    0
  );
  const firstOrderAt = matchingOrders[0]!.createdAt;
  const lastOrderAt = matchingOrders[matchingOrders.length - 1]!.createdAt;
  const latest = matchingOrders[matchingOrders.length - 1]!;

  if (!existing) {
    return prisma.branchCustomer.create({
      data: {
        id: randomUUID(),
        branchId,
        phone: normalizedPhone,
        name: latest.customerName?.trim() || null,
        email: latest.customerEmail?.trim() || null,
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
      name: latest.customerName?.trim() || existing.name,
      email: latest.customerEmail?.trim() || existing.email,
      orderCount,
      totalSpent,
      totalSaved,
      firstOrderAt,
      lastOrderAt
    }
  });
}

async function syncRegisteredCustomersForBranch(branchId: string) {
  const orders = await prisma.order.findMany({
    where: {
      branchId,
      customerId: { not: null },
      status: { notIn: ["cancelled", "rejected"] }
    },
    select: { customerId: true },
    distinct: ["customerId"]
  });

  const customerIds = orders.map((o) => o.customerId!).filter(Boolean);
  if (!customerIds.length) return 0;

  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds } },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      phoneNumber: true,
      marketingEmail: true,
      marketingSMS: true,
      marketingWhatsApp: true
    }
  });

  let synced = 0;
  for (const customer of customers) {
    const phone = normalizeBranchPhone(customer.phone ?? customer.phoneNumber);
    if (!phone) continue;
    await upsertRegisteredBranchCustomer({
      branchId,
      phone,
      name: customer.name,
      email: customer.email,
      marketingEmail: customer.marketingEmail,
      marketingSMS: customer.marketingSMS,
      marketingWhatsApp: customer.marketingWhatsApp
    });
    synced += 1;
  }
  return synced;
}

async function rebuildBranchCustomersFromOrders(branchId: string) {
  const orders = await prisma.order.findMany({
    where: {
      branchId,
      status: { notIn: ["cancelled", "rejected"] },
      customerPhone: { not: null }
    },
    select: { customerPhone: true },
    distinct: ["customerPhone"]
  });

  let updated = 0;
  for (const order of orders) {
    const phone = normalizeBranchPhone(order.customerPhone);
    if (!phone) continue;
    await recalculateBranchCustomerStats(branchId, phone);
    updated += 1;
  }
  return updated;
}

export async function reconcileAllBranchCustomers(branchId?: string) {
  const branches = branchId
    ? [{ id: branchId }]
    : await prisma.branch.findMany({ select: { id: true } });

  let updated = 0;
  let registered = 0;
  let removed = 0;

  for (const branch of branches) {
    updated += await rebuildBranchCustomersFromOrders(branch.id);
    registered += await syncRegisteredCustomersForBranch(branch.id);

    const stale = await prisma.branchCustomer.findMany({
      where: {
        branchId: branch.id,
        orderCount: 0,
        marketingEmail: false,
        marketingSMS: false,
        marketingWhatsApp: false
      },
      select: { branchId: true, phone: true }
    });

    for (const customer of stale) {
      await prisma.branchCustomer.delete({
        where: { branchId_phone: { branchId: customer.branchId, phone: customer.phone } }
      });
      removed += 1;
    }
  }

  return { updated, registered, removed };
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
