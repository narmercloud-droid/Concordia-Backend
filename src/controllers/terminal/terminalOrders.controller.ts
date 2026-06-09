import { prisma } from "../../prisma/client.ts";
import { broadcastToTerminal } from "../../services/realtime/realtime.service.ts";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.ts";
import { resolveBranchByCode } from "../../services/terminal/branchCode.service.ts";
import { getTerminalDailyReport } from "../../services/terminal/terminalDailyReport.service.ts";
import { ordersService } from "../../services/orders.service.ts";
import { env } from "../../config/env.ts";
import { wrap, fail } from "../../contracts/api.js";
import { getBerlinTodayRange, isWithinBerlinToday } from "../../utils/berlinTime.ts";

function buildCourierUrl(token?: string | null) {
  if (!token) return null;
  const base = env.FRONTEND_URL ?? "http://localhost:5173";
  return `${base}/courier/order?token=${token}`;
}

function mapOrderLine(line: any) {
  return {
    ...line,
    kitchen: line.item?.kitchen ?? "B",
    name: line.item?.name ?? line.name,
    variants: (line.variants ?? []).map((v: any) => ({
      name: v.name,
      price: Number(v.price ?? 0)
    })),
    extras: (line.extras ?? []).map((e: any) => ({
      name: e.name,
      price: Number(e.price ?? 0)
    })),
    notes: line.notes ?? null
  };
}

function enrichOrder(order: any) {
  return {
    ...order,
    courierUrl: buildCourierUrl(order.courierToken),
    items: order.items?.map(mapOrderLine)
  };
}

export const activateTerminalByCode = wrap(async (req) => {
  const branchCode = req.body?.branch_code ?? req.body?.branchCode ?? req.body?.code;
  if (!branchCode) throw fail("INVALID_INPUT", "branch_code is required");

  const resolved = await resolveBranchByCode(String(branchCode));
  if (!resolved) throw fail("NOT_FOUND", "Invalid branch code");

  if (resolved.activationCode) {
    await prisma.activationCode.update({
      where: { id: resolved.activationCode.id },
      data: { used: true, usedAt: new Date(), deviceId: req.body?.deviceId ?? null }
    });
  }

  return {
    branchId: resolved.branch.id,
    branchName: resolved.branch.name,
    terminalCode: String(branchCode).trim().toUpperCase()
  };
});

export const getTerminalOrders = wrap(async (req) => {
  try {
    const { branchId } = req.query;
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");

    const orders = await prisma.order.findMany({
      where: { branchId: String(branchId) },
      include: {
        items: {
          include: {
            item: true,
            variants: true,
            extras: true
          }
        },
        trackingEvents: true,
        courierLocations: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return orders.map(enrichOrder);
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Server error');
  }
});

export const confirmTerminalOrder = wrap(async (req) => {
  const { id } = req.params;
  const prepMinutes = Number(req.body?.prepMinutes ?? req.body?.prep_minutes);

  try {
    const order = await ordersService.confirmOrderWithPrepTime(id, prepMinutes);
    return enrichOrder(order);
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not confirm order");
  }
});

export const getTerminalOrderDetails = wrap(async (req) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        trackingEvents: true,
        courierLocations: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        items: {
          include: {
            item: true,
            variants: true,
            extras: true
          }
        },
        customer: {
          include: { addresses: true }
        }
      }
    });

    if (!order) throw fail('NOT_FOUND', 'Order not found');
    if (!isWithinBerlinToday(order.createdAt)) {
      throw fail('NOT_FOUND', 'Order not available');
    }

    const response = enrichOrder(order);
    broadcastToTerminal(order.branchId, "order_update", response);
    return response;
  } catch (err) {
    console.error(err);
    throw fail('INTERNAL_ERROR', 'Server error');
  }
});

export const acceptOrder = wrap(async (req) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "accepted");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return updated;
});

export const getTerminalDailyReportHandler = wrap(async (req) => {
  const { branchId } = req.query;
  if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
  return getTerminalDailyReport(String(branchId));
});

export const rejectOrder = wrap(async (req) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "rejected");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return updated;
});

export const rejectTerminalOrder = wrap(async (req) => {
  const { id } = req.params;
  const reason = String(req.body?.reason ?? req.body?.rejectReason ?? "").trim() || null;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw fail("NOT_FOUND", "Order not found");
  if (!["pending", "new", "assigned", "acknowledged"].includes(order.status)) {
    throw fail("INVALID_INPUT", "Order cannot be rejected in its current state");
  }

  const updated = await OrderLifecycleService.updateStatus(id, "rejected", undefined, {
    ...(reason ? { notes: order.notes ? `${order.notes}\n[Rejected] ${reason}` : `[Rejected] ${reason}` } : {})
  });

  const fullOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { item: true, variants: true, extras: true } }
    }
  });

  const payload = enrichOrder(fullOrder);
  broadcastToTerminal(order.branchId, "order:rejected", payload);
  return payload;
});

function readBranchConfig(configJson: unknown) {
  return (configJson && typeof configJson === "object" ? configJson : {}) as Record<string, unknown>;
}

export const getTerminalBranchStatus = wrap(async (req) => {
  const { branchId } = req.query;
  if (!branchId) throw fail("INVALID_INPUT", "branchId is required");

  const config = await prisma.branchConfig.findUnique({
    where: { branchId: String(branchId) }
  });
  const json = readBranchConfig(config?.configJson);
  return {
    branchId: String(branchId),
    status: String(json.status ?? "live"),
    ordersPaused: Boolean(json.ordersPaused ?? false)
  };
});

export const updateTerminalBranchStatus = wrap(async (req) => {
  const branchId = String(req.body?.branchId ?? "");
  if (!branchId) throw fail("INVALID_INPUT", "branchId is required");

  const ordersPaused = Boolean(req.body?.ordersPaused);
  const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
  const json = readBranchConfig(existing?.configJson);

  const nextJson: Record<string, unknown> = { ...json, ordersPaused };
  await prisma.branchConfig.upsert({
    where: { branchId },
    create: { branchId, configJson: nextJson },
    update: { configJson: nextJson }
  });

  broadcastToTerminal(branchId, "branch:status", { branchId, ordersPaused });
  return { branchId, status: String(nextJson.status ?? "live"), ordersPaused };
});

