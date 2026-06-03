import { PrismaClient } from "@prisma/client";
import { ordersService } from "../services/orders.service.js";
const prisma = new PrismaClient();
export class OrderFactory {
    static async createTestOrder(overrides = {}) {
        const branch = await prisma.branch.findFirst();
        if (!branch)
            throw new Error("No branch found. Run seed first.");
        const customer = await prisma.customer.findFirst();
        if (!customer)
            throw new Error("No customer found. Run seed first.");
        const item = await prisma.menuItem.findFirst();
        if (!item)
            throw new Error("No menu item found. Run seed first.");
        const variant = await prisma.variant.findFirst({
            include: { group: true }
        });
        if (!variant)
            throw new Error("No variant found. Run seed first.");
        const payload = {
            branchId: branch.id,
            customerId: customer.id,
            items: [
                {
                    itemId: item.id,
                    quantity: 1,
                    price: item.basePrice,
                    variantId: variant.id
                }
            ],
            ...overrides
        };
        const order = await ordersService.createOrder(payload);
        return order;
    }
}
