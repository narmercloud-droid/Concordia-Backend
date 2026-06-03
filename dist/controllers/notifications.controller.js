import { prisma } from "../prisma/client.js";
import { notificationsService } from "../services/notifications.service.js";
import { wrap } from "../contracts/api.js";
export const NotificationsController = {
    updatePreferences: wrap(async (req) => {
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
    sendMarketingSMS: wrap(async (req) => {
        const { message, segment } = req.body;
        let customers = [];
        if (segment === "all") {
            customers = await prisma.customer.findMany();
        }
        else if (segment === "recent") {
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
