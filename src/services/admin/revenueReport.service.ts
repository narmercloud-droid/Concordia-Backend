import { prisma } from "../../prisma/client.ts";
import { getBerlinDateRange } from "../../utils/berlinTime.ts";

const CANCELLED_STATUSES = ["cancelled", "rejected"];

const COMPANY = {
  name: "Pizzeria Concordia",
  owner: "Alan Ahmad",
  address: "Concordienplatz 1, 47906 Kempen",
  vatId: "DE366744420",
  email: "info@concordiapizza.de"
};

function money(value: number | null | undefined) {
  return Number(value ?? 0);
}

function normalizePhone(phone?: string | null) {
  return (phone ?? "").replace(/\D/g, "");
}

export function paymentLabel(method?: string | null) {
  const m = (method ?? "cash").toLowerCase();
  if (m === "cod" || m === "cash") return "Bar";
  if (m === "card" || m === "stripe") return "Karte";
  if (m === "apple_pay") return "Apple Pay";
  if (m === "google_pay") return "Google Pay";
  if (m === "paypal") return "PayPal";
  if (m === "klarna") return "Klarna";
  if (m === "sepa") return "SEPA";
  return method ?? "Sonstige";
}

function fulfillmentLabel(type?: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("pickup") || t.includes("abhol")) return "Abholung";
  return "Lieferung";
}

function isCashMethod(method?: string | null) {
  const m = (method ?? "cash").toLowerCase();
  return m === "cash" || m === "cod";
}

export function isCountableRevenueOrder(order: {
  status: string;
  paymentMethod?: string | null;
  paymentStatus: string;
  paidAt?: Date | null;
}) {
  if (CANCELLED_STATUSES.includes(order.status)) return false;
  if (isCashMethod(order.paymentMethod)) return true;
  return order.paymentStatus === "paid" || order.paidAt != null;
}

function customerKey(order: { customerId?: string | null; customerPhone?: string | null }) {
  if (order.customerId) return `id:${order.customerId}`;
  const phone = normalizePhone(order.customerPhone);
  if (phone) return `phone:${phone}`;
  return null;
}

export type RevenueReportParams = {
  branchId: string;
  from: string;
  to: string;
};

export async function getRevenueReport(params: RevenueReportParams) {
  const { branchId, from, to } = params;
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error("Branch not found");

  const { start, end, periodLabel } = getBerlinDateRange(from, to);

  const orders = await prisma.order.findMany({
    where: {
      branchId,
      createdAt: { gte: start, lt: end }
    },
    select: {
      id: true,
      status: true,
      orderTotal: true,
      deliveryFee: true,
      discount: true,
      giftCardAmount: true,
      fulfillmentType: true,
      paymentMethod: true,
      paymentStatus: true,
      paidAt: true,
      customerId: true,
      customerPhone: true,
      isGuest: true,
      createdAt: true
    },
    orderBy: { createdAt: "asc" }
  });

  const priorOrders = await prisma.order.findMany({
    where: {
      branchId,
      createdAt: { lt: start },
      status: { notIn: CANCELLED_STATUSES }
    },
    select: {
      customerId: true,
      customerPhone: true
    }
  });

  const priorCustomerKeys = new Set<string>();
  for (const order of priorOrders) {
    const key = customerKey(order);
    if (key) priorCustomerKeys.add(key);
  }

  const completed = orders.filter((o) => isCountableRevenueOrder(o));
  const cancelled = orders.filter((o) => CANCELLED_STATUSES.includes(o.status));

  const grossRevenue = completed.reduce((sum, o) => sum + money(o.orderTotal), 0);
  const deliveryFees = completed.reduce((sum, o) => sum + money(o.deliveryFee), 0);
  const discounts = completed.reduce(
    (sum, o) => sum + money(o.discount) + money(o.giftCardAmount),
    0
  );

  const paymentBreakdown: Record<string, { count: number; total: number }> = {};
  const customerTypeBreakdown = {
    guest: { count: 0, total: 0 },
    registered: { count: 0, total: 0 }
  };
  const newReturningBreakdown = {
    newCustomers: { count: 0, total: 0 },
    returningCustomers: { count: 0, total: 0 },
    unknown: { count: 0, total: 0 }
  };

  const deliveryOrders = completed.filter(
    (o) => fulfillmentLabel(o.fulfillmentType) === "Lieferung"
  );
  const pickupOrders = completed.filter(
    (o) => fulfillmentLabel(o.fulfillmentType) === "Abholung"
  );

  for (const order of completed) {
    const label = paymentLabel(order.paymentMethod);
    if (!paymentBreakdown[label]) paymentBreakdown[label] = { count: 0, total: 0 };
    paymentBreakdown[label].count += 1;
    paymentBreakdown[label].total += money(order.orderTotal);

    const total = money(order.orderTotal);
    if (order.isGuest || !order.customerId) {
      customerTypeBreakdown.guest.count += 1;
      customerTypeBreakdown.guest.total += total;
    } else {
      customerTypeBreakdown.registered.count += 1;
      customerTypeBreakdown.registered.total += total;
    }

    const key = customerKey(order);
    if (!key) {
      newReturningBreakdown.unknown.count += 1;
      newReturningBreakdown.unknown.total += total;
    } else if (priorCustomerKeys.has(key)) {
      newReturningBreakdown.returningCustomers.count += 1;
      newReturningBreakdown.returningCustomers.total += total;
    } else {
      newReturningBreakdown.newCustomers.count += 1;
      newReturningBreakdown.newCustomers.total += total;
      priorCustomerKeys.add(key);
    }
  }

  const avgOrderValue = completed.length ? grossRevenue / completed.length : 0;

  return {
    company: COMPANY,
    branchId,
    branchName: branch.name,
    timezone: "Europe/Berlin",
    from,
    to,
    periodLabel,
    generatedAt: new Date().toISOString(),
    orderCount: completed.length,
    cancelledCount: cancelled.length,
    grossRevenue,
    deliveryFees,
    discounts,
    netRevenue: grossRevenue - discounts,
    avgOrderValue,
    delivery: {
      count: deliveryOrders.length,
      revenue: deliveryOrders.reduce((s, o) => s + money(o.orderTotal), 0)
    },
    pickup: {
      count: pickupOrders.length,
      revenue: pickupOrders.reduce((s, o) => s + money(o.orderTotal), 0)
    },
    paymentBreakdown: Object.entries(paymentBreakdown)
      .map(([method, stats]) => ({ method, ...stats }))
      .sort((a, b) => b.total - a.total),
    customerTypeBreakdown,
    newReturningBreakdown,
    legalNote:
      "Umsatzbericht für interne Buchführung. Barumsätze bei Übergabe; Online-Zahlungen bei Zahlungsstatus „paid“. Alle Beträge in EUR."
  };
}
