import { randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../prisma/client.ts";
import { broadcastToTerminal } from "../../services/realtime/realtime.service.ts";
import { OrderLifecycleService } from "../../services/order/orderLifecycle.service.ts";
import { resolveBranchByCode } from "../../services/terminal/branchCode.service.ts";
import { getTerminalDailyReport } from "../../services/terminal/terminalDailyReport.service.ts";
import { advanceTerminalOrderStatus } from "../../services/terminal/terminalOrderStatus.service.ts";
import { ordersService } from "../../services/orders.service.ts";
import { isKitchenReadyOrder } from "../../utils/orderPayment.ts";
import { buildCourierUrl } from "../../utils/customerOrderUrls.ts";
import { wrap, fail } from "../../contracts/api.js";
import { isApiError } from "../../contracts/http.js";
import { getBerlinTodayRange, isWithinBerlinToday } from "../../utils/berlinTime.ts";

function terminalBranchId(req: { user?: { branchId?: string }; query?: Record<string, unknown>; body?: Record<string, unknown> }) {
  const branchId = req.user?.branchId;
  if (!branchId) throw fail("UNAUTHORIZED", "Terminal authentication required");

  const requested =
    (req.query?.branchId != null ? String(req.query.branchId) : "") ||
    (req.body?.branchId != null ? String(req.body.branchId) : "");
  if (requested && requested !== branchId) {
    throw fail("FORBIDDEN", "Branch does not match terminal credentials");
  }
  return branchId;
}

async function assertOrderInTerminalBranch(orderId: string, branchId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw fail("NOT_FOUND", "Order not found");
  if (order.branchId !== branchId) throw fail("FORBIDDEN", "Order does not belong to this terminal branch");
  return order;
}

function newActivationToken() {
  return randomBytes(32).toString("hex");
}

function mapOrderLine(line: any) {
  return {
    ...line,
    kitchen: line.item?.kitchen ?? "B",
    name: line.item?.name ?? line.name,
    variants: (line.variants ?? []).map((v: any) => ({
      name: v.name,
      value: v.value ?? v.option ?? v.label ?? v.name,
      price: Number(v.price ?? 0)
    })),
    extras: (line.extras ?? line.addOns ?? []).map((e: any) => ({
      name: e.name,
      price: Number(e.price ?? 0)
    })),
    notes: line.notes ?? null
  };
}

function enrichOrder(order: any) {
  return {
    ...order,
    courierUrl: order.courierToken ? buildCourierUrl(order.courierToken) : null,
    items: order.items?.map(mapOrderLine)
  };
}

export const activateTerminalByCode = wrap(async (req) => {
  const branchCode = req.body?.branch_code ?? req.body?.branchCode ?? req.body?.code;
  if (!branchCode) throw fail("INVALID_INPUT", "branch_code is required");

  const resolved = await resolveBranchByCode(String(branchCode));
  if (!resolved) throw fail("NOT_FOUND", "Invalid branch code");

  const deviceId = req.body?.deviceId != null ? String(req.body.deviceId).trim() : "";
  const terminalName = deviceId
    ? `device:${deviceId}`
    : `branch:${resolved.branch.id}:default`;

  if (resolved.activationCode) {
    await prisma.activationCode.update({
      where: { id: resolved.activationCode.id },
      data: { used: true, usedAt: new Date(), deviceId: deviceId || null }
    });
  }

  let terminal = await prisma.terminal.findFirst({
    where: { branchId: resolved.branch.id, name: terminalName }
  });

  if (!terminal) {
    terminal = await prisma.terminal.create({
      data: {
        id: randomUUID(),
        name: terminalName,
        activation_token: newActivationToken(),
        branchId: resolved.branch.id,
        isOnline: true,
        lastSeen: new Date()
      }
    });
  } else {
    terminal = await prisma.terminal.update({
      where: { id: terminal.id },
      data: {
        isOnline: true,
        lastSeen: new Date()
      }
    });
  }

  return {
    branchId: resolved.branch.id,
    branchName: resolved.branch.name,
    terminalCode: String(branchCode).trim().toUpperCase(),
    terminalId: terminal.id,
    activationToken: terminal.activation_token
  };
});

export const getTerminalOrders = wrap(async (req) => {
  const branchId = terminalBranchId(req);

  const today = getBerlinTodayRange();
  const orders = await prisma.order.findMany({
    where: {
      branchId,
      createdAt: {
        gte: today.start,
        lt: today.end
      }
    },
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

  return orders.filter(isKitchenReadyOrder).map(enrichOrder);
});

export const confirmTerminalOrder = wrap(async (req) => {
  const { id } = req.params;
  const branchId = terminalBranchId(req);
  await assertOrderInTerminalBranch(id, branchId);
  const prepMinutes = Number(req.body?.prepMinutes ?? req.body?.prep_minutes);

  try {
    const order = await ordersService.confirmOrderWithPrepTime(id, prepMinutes);
    return enrichOrder(order);
  } catch (err: unknown) {
    if (isApiError(err)) throw err;
    const message = err instanceof Error ? err.message : "Could not confirm order";
    throw fail("INVALID_INPUT", message);
  }
});

export const getTerminalOrderDetails = wrap(async (req) => {
  const { id } = req.params;
  const branchId = terminalBranchId(req);

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

  if (!order) throw fail("NOT_FOUND", "Order not found");
  if (order.branchId !== branchId) throw fail("FORBIDDEN", "Order does not belong to this terminal branch");
  if (!isWithinBerlinToday(order.createdAt)) {
    throw fail("NOT_FOUND", "Order not available");
  }
  if (!isKitchenReadyOrder(order)) {
    throw fail("NOT_FOUND", "Order not available");
  }

  const response = enrichOrder(order);
  return response;
});

export const acceptOrder = wrap(async (req) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "accepted");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return updated;
});

export const getTerminalDailyReportHandler = wrap(async (req) => {
  const branchId = terminalBranchId(req);
  return getTerminalDailyReport(branchId);
});

export const rejectOrder = wrap(async (req) => {
  const { orderId } = req.params;

  const updated = await OrderLifecycleService.updateStatus(orderId, "rejected");

  req.io.to(`branch_${req.terminal.branchId}`).emit("order_updated", updated);

  return updated;
});

export const rejectTerminalOrder = wrap(async (req) => {
  const { id } = req.params;
  const branchId = terminalBranchId(req);
  const reason = String(req.body?.reason ?? req.body?.rejectReason ?? "").trim() || null;

  const order = await assertOrderInTerminalBranch(id, branchId);
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
  const branchId = terminalBranchId(req);

  const config = await prisma.branchConfig.findUnique({
    where: { branchId }
  });
  const json = readBranchConfig(config?.configJson);
  return {
    branchId,
    status: String(json.status ?? "live"),
    ordersPaused: Boolean(json.ordersPaused ?? false)
  };
});

const TERMINAL_STATUS_TARGETS = new Set([
  "preparing",
  "ready_for_pickup",
  "ready",
  "out_for_delivery",
  "picked_up",
  "delivered",
  "completed"
]);

export const updateTerminalOrderStatus = wrap(async (req) => {
  const { id } = req.params;
  const branchId = terminalBranchId(req);
  const status = String(req.body?.status ?? "").trim();
  if (!status || !TERMINAL_STATUS_TARGETS.has(status)) {
    throw fail("INVALID_INPUT", "Invalid terminal order status");
  }

  const order = await assertOrderInTerminalBranch(id, branchId);

  let updated;
  try {
    updated = await advanceTerminalOrderStatus(id, status);
  } catch (err: unknown) {
    if (isApiError(err)) throw err;
    const message = err instanceof Error ? err.message : "Could not update order status";
    throw fail("INVALID_INPUT", message);
  }

  const fullOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { item: true, variants: true, extras: true } }
    }
  });

  const payload = enrichOrder(fullOrder ?? updated);
  broadcastToTerminal(order.branchId, "order_update", payload);
  return payload;
});

export const updateTerminalBranchStatus = wrap(async (req) => {
  const branchId = terminalBranchId(req);

  const ordersPaused = Boolean(req.body?.ordersPaused);
  const existing = await prisma.branchConfig.findUnique({ where: { branchId } });
  const json = readBranchConfig(existing?.configJson);

  const nextJson: Record<string, unknown> = { ...json, ordersPaused };
  await prisma.branchConfig.upsert({
    where: { branchId },
    create: { id: randomUUID(), branchId, configJson: nextJson },
    update: { configJson: nextJson, version: { increment: 1 } }
  });

  broadcastToTerminal(branchId, "branch:status", { branchId, ordersPaused });
  return { branchId, status: String(nextJson.status ?? "live"), ordersPaused };
});

