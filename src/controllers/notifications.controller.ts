import type { AuthenticatedRequest } from "../globalTypes.ts";
import { prisma } from "../prisma/client.ts";
import { notificationsService } from "../services/notifications.service.ts";
import { wrap } from "../contracts/api.js";

export const NotificationsController = {
  updatePreferences: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.user.id;

    const prefs = await prisma.notificationPreference.upsert({
      where: { customerId },
      update: req.body,
      create: {
        customerId,
        ...req.body
      }
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

    const phones = customers
      .filter(c => c.phone)
      .map(c => c.phone);

    await notificationsService.sendMarketingSMS(phones, message);

    return { success: true, sent: phones.length };
  })
};







