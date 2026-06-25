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
    const { message, segment } = req.body;

    let customers = [];

    if (segment === "all") {
      customers = await prisma.customer.findMany();
    } else if (segment === "recent") {
      customers = await prisma.customer.findMany({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      });
    }

    const phones = customers.filter((c) => c.phone).map((c) => c.phone);

    await notificationsService.sendMarketingSMS(phones, message);

    return { success: true, sent: phones.length };
  })
};
