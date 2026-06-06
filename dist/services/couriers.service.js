import { prisma } from "../prisma/client.js";
import { v4 as uuid } from "uuid";
import { OrderLifecycleService } from "./order/orderLifecycle.service.js";
const TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
export class CourierService {
    async generateCourierToken(orderId) {
        const token = uuid();
        const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS);
        return OrderLifecycleService.setCourierToken(orderId, token, expiresAt);
    }
    async validateCourierToken(orderId, token) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return null;
        if (order.courierToken !== token)
            return null;
        if (!order.courierTokenExpiresAt)
            return null;
        if (order.courierTokenExpiresAt < new Date())
            return null;
        return order;
    }
    async claimOrder(orderId) {
        return OrderLifecycleService.updateCourierStatus(orderId, "accepted");
    }
    async updateStatus(orderId, status) {
        return OrderLifecycleService.updateCourierStatus(orderId, status);
    }
}
export const courierService = new CourierService();
