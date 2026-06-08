import { prisma } from "../../prisma/client.ts";
import { getBerlinTodayRange } from "../../utils/berlinTime.ts";

const COMPLETED_STATUSES = ["accepted", "preparing", "ready", "delivered", "completed", "picked_up"];
const CANCELLED_STATUSES = ["cancelled", "rejected"];

function money(value: number | null | undefined) {
  return Number(value ?? 0);
}

function formatEur(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function paymentLabel(method?: string | null) {
  const m = (method ?? "cash").toLowerCase();
  if (m === "cod" || m === "cash") return "Bar";
  if (m === "card") return "Karte";
  if (m === "paypal") return "PayPal";
  if (m === "klarna") return "Klarna";
  return method ?? "Bar";
}

function fulfillmentLabel(type?: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("pickup") || t.includes("abhol")) return "Abholung";
  return "Lieferung";
}

export async function getTerminalDailyReport(branchId: string) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error("Branch not found");

  const { start, end, ymd, dateLabel } = getBerlinTodayRange();

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
      createdAt: true
    },
    orderBy: { createdAt: "asc" }
  });

  const completed = orders.filter((o) => !CANCELLED_STATUSES.includes(o.status));
  const cancelled = orders.filter((o) => CANCELLED_STATUSES.includes(o.status));

  const grossRevenue = completed.reduce((sum, o) => sum + money(o.orderTotal), 0);
  const deliveryFees = completed.reduce((sum, o) => sum + money(o.deliveryFee), 0);
  const discounts = completed.reduce((sum, o) => sum + money(o.discount) + money(o.giftCardAmount), 0);

  const deliveryOrders = completed.filter((o) => fulfillmentLabel(o.fulfillmentType) === "Lieferung");
  const pickupOrders = completed.filter((o) => fulfillmentLabel(o.fulfillmentType) === "Abholung");

  const paymentBreakdown: Record<string, { count: number; total: number }> = {};
  for (const order of completed) {
    const key = paymentLabel(order.paymentMethod);
    if (!paymentBreakdown[key]) paymentBreakdown[key] = { count: 0, total: 0 };
    paymentBreakdown[key].count += 1;
    paymentBreakdown[key].total += money(order.orderTotal);
  }

  const avgOrderValue = completed.length ? grossRevenue / completed.length : 0;

  const summary = {
    branchId,
    branchName: branch.name,
    date: ymd,
    dateLabel,
    timezone: "Europe/Berlin",
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
    paymentBreakdown: Object.entries(paymentBreakdown).map(([method, stats]) => ({
      method,
      count: stats.count,
      total: stats.total
    }))
  };

  const receiptLines = buildReceiptLines(summary);
  return { ...summary, receiptText: receiptLines.join("\n"), receiptLines };
}

function buildReceiptLines(summary: {
  branchName: string;
  dateLabel: string;
  orderCount: number;
  cancelledCount: number;
  grossRevenue: number;
  deliveryFees: number;
  discounts: number;
  netRevenue: number;
  avgOrderValue: number;
  delivery: { count: number; revenue: number };
  pickup: { count: number; revenue: number };
  paymentBreakdown: Array<{ method: string; count: number; total: number }>;
}) {
  const lines = [
    "CONCORDIA TAGESABSCHLUSS",
    "========================",
    summary.branchName,
    summary.dateLabel,
    "",
    `Bestellungen:        ${summary.orderCount}`,
    `Storniert:           ${summary.cancelledCount}`,
    "",
    `Umsatz brutto:       ${formatEur(summary.grossRevenue)}`,
    `Rabatte/Gutscheine:  ${formatEur(summary.discounts)}`,
    `Umsatz netto:        ${formatEur(summary.netRevenue)}`,
    `Liefergebuehren:     ${formatEur(summary.deliveryFees)}`,
    `Ø Bestellwert:       ${formatEur(summary.avgOrderValue)}`,
    "",
    "Nach Art:",
    `  Lieferung: ${summary.delivery.count} (${formatEur(summary.delivery.revenue)})`,
    `  Abholung:  ${summary.pickup.count} (${formatEur(summary.pickup.revenue)})`,
    "",
    "Zahlungsarten:"
  ];

  if (summary.paymentBreakdown.length === 0) {
    lines.push("  (keine Bestellungen)");
  } else {
    for (const row of summary.paymentBreakdown) {
      lines.push(`  ${row.method}: ${row.count}x ${formatEur(row.total)}`);
    }
  }

  lines.push("", "========================", "Nur heutige Daten", new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }));
  return lines;
}
