import type { AuthenticatedRequest } from "../globalTypes.ts";
import { prisma } from "../prisma/client.ts";
import { fail } from "../contracts/api.js";
import { notificationsService } from "../services/notifications.service.ts";
import { wrap } from "../contracts/api.js";

type PushRequest = AuthenticatedRequest & {
  user?: { id: string };
};

export const NotificationsController = {
  registerPush: wrap(async (req: PushRequest) => {
    const { token, allowOffers, allowOrders, branchId } = req.body ?? {};

    if (!token) {
      return fail("VALIDATION_ERROR", "Push subscription token is required");
    }

    if (!notificationsService.isPushEnabled()) {
      return fail("SERVICE_UNAVAILABLE", "Push notifications are not configured on the server");
    }

    const parsed = notificationsService.parsePushToken(token);
    if (!parsed) {
      return fail("VALIDATION_ERROR", "Invalid push subscription");
    }

    const row = await notificationsService.registerPushSubscription({
      token,
      customerId: req.user?.id ?? null,
      allowOffers: allowOffers !== false,
      allowOrders: allowOrders !== false,
      branchId: typeof branchId === "string" ? branchId : null
    });

    return { registered: true, id: row.id };
  }),

  unregisterPush: wrap(async (req: PushRequest) => {
    const { token } = req.body ?? {};
    if (!token) {
      return fail("VALIDATION_ERROR", "Push subscription token is required");
    }

    await notificationsService.unregisterPushSubscription(token);
    return { removed: true };
  }),

  updatePreferences: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.user.id;
    const { allowPush, allowOffers, allowSMS } = req.body ?? {};

    const prefs = await notificationsService.updateCustomerPreferences(customerId, {
      ...(typeof allowPush === "boolean" ? { allowPush } : {}),
      ...(typeof allowOffers === "boolean" ? { allowOffers } : {}),
      ...(typeof allowSMS === "boolean" ? { allowSMS } : {})
    });

    return prefs;
  }),

  sendMarketingSMS: wrap(async (req: AuthenticatedRequest) => {
    const { message, segment, branchId: bodyBranchId } = req.body ?? {};
    const text = String(message ?? "").trim();
    const user = req.user as { branchId?: string; role?: string };
    const managerBranchId = (req as AuthenticatedRequest & { managerBranchId?: string })
      .managerBranchId;
    const branchId = String(bodyBranchId ?? managerBranchId ?? user.branchId ?? "").trim();

    if (text.length < 5) {
      return fail("VALIDATION_ERROR", "Message must be at least 5 characters");
    }
    if (!branchId) {
      return fail("VALIDATION_ERROR", "branchId is required");
    }
    if (user.role === "manager" && user.branchId && user.branchId !== branchId) {
      return fail("FORBIDDEN", "Managers can only send SMS for their own branch");
    }

    const since =
      segment === "recent"
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : null;

    const customers = await prisma.branchCustomer.findMany({
      where: {
        branchId,
        marketingSMS: true,
        phone: { not: "" },
        ...(since ? { lastOrderAt: { gte: since } } : {})
      },
      select: { phone: true }
    });

    const phones = [...new Set(customers.map((c) => c.phone.trim()).filter(Boolean))] as string[];
    if (!phones.length) {
      return fail("NOT_FOUND", "No customers with SMS marketing consent for this branch");
    }

    const result = await notificationsService.sendMarketingSMS(phones, text);
    return { success: true, sent: result.sent, total: phones.length, branchId };
  })
};
