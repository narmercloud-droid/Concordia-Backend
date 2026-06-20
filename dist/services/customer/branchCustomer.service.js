import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.js";
export function resolvePreferredChannel(input) {
    if (input.marketingWhatsApp)
        return "whatsapp";
    if (input.marketingSMS)
        return "sms";
    if (input.marketingEmail)
        return "email";
    return null;
}
function parseBirthday(value) {
    if (!value)
        return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
export async function syncBranchCustomerFromOrder(input) {
    const phone = input.phone.trim();
    const branchId = input.branchId;
    if (!phone || !branchId)
        return null;
    const now = new Date();
    const hasMarketing = Boolean(input.marketingEmail) ||
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
                consentAt: hasMarketing && !existing.consentAt ? now : existing.consentAt,
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
export async function listBranchCustomers(branchId, options) {
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
export async function getBranchCustomerStats(branchId) {
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
export async function getCustomerOrderHistory(branchId, phone) {
    return prisma.order.findMany({
        where: { branchId, customerPhone: phone },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
            items: { include: { item: true } }
        }
    });
}
export function branchCustomersToCsv(customers) {
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
    const rows = customers.map((c) => [
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
    ].join(","));
    return [header, ...rows].join("\n");
}
function csvEscape(value) {
    if (value.includes(",") || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
export async function getWinBackCandidates(branchId) {
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
export async function getBirthdayCandidates(branchId) {
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
        if (!c.birthday)
            return false;
        return (c.birthday.getUTCMonth() + 1 === month && c.birthday.getUTCDate() === day);
    });
}
