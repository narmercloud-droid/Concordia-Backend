import { randomBytes } from "crypto";
import { prisma } from "../../prisma/client.js";
import { OrderLifecycleService } from "../order/orderLifecycle.service.js";
export async function generateCourierToken(orderId) {
    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
    await OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
    return token;
}
export async function validateCourierToken(token) {
    if (!token)
        return null;
    const order = await prisma.order.findFirst({
        where: {
            courierToken: token,
            courierTokenExpiresAt: { gt: new Date() }
        },
        include: {
            branch: true,
            items: {
                include: {
                    item: true
                }
            },
            customer: {
                include: { addresses: true }
            }
        }
    });
    return order;
}
