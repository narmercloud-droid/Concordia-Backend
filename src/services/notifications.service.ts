import { sendPush } from "./notifications/notification.service.js";
import {
  broadcastOfferPush,
  parsePushToken,
  removeWebPushSubscription,
  sendOfferPushToCustomerEmail,
  upsertWebPushSubscription
} from "./notifications/webPushSubscription.service.ts";
import { prisma } from "../prisma/client.ts";

export const notificationsService = {
  isPushEnabled() {
    return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  },

  async registerPushSubscription(input: {
    token: unknown;
    customerId?: string | null;
    allowOffers?: boolean;
    allowOrders?: boolean;
    branchId?: string | null;
  }) {
    const row = await upsertWebPushSubscription(input);

    if (input.customerId) {
      await prisma.notificationPreference.upsert({
        where: { customerId: input.customerId },
        create: {
          customerId: input.customerId,
          allowPush: true,
          allowOffers: input.allowOffers ?? true
        },
        update: {
          allowPush: true,
          ...(typeof input.allowOffers === "boolean" ? { allowOffers: input.allowOffers } : {})
        }
      });
    }

    return row;
  },

  async unregisterPushSubscription(token: unknown) {
    return removeWebPushSubscription(token);
  },

  async updateCustomerPreferences(
    customerId: string,
    prefs: { allowPush?: boolean; allowOffers?: boolean; allowSMS?: boolean }
  ) {
    return prisma.notificationPreference.upsert({
      where: { customerId },
      create: { customerId, ...prefs },
      update: prefs
    });
  },

  async sendMarketingSMS(_phones: string[], _message: string) {
    // SMS marketing handled via branch messaging / Twilio elsewhere.
    return { sent: 0 };
  },

  async sendOfferNotification(input: {
    title: string;
    body: string;
    url: string;
    branchId?: string | null;
    customerEmail?: string | null;
  }) {
    if (input.customerEmail) {
      const targeted = await sendOfferPushToCustomerEmail(
        input.customerEmail,
        input.title,
        input.body,
        input.url
      );
      if (targeted.sent > 0) return targeted;
    }

    return broadcastOfferPush(input);
  },

  parsePushToken,
  sendPush
};
