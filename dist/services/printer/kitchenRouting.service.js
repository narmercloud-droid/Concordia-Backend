import { prisma } from "../../prisma/client.js";
import { enqueuePrintJob } from "./printerQueue.service.js";
export async function routeOrderToKitchens(orderId) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: { item: true }
            }
        }
    });
    if (!order)
        return;
    const kitchenBItems = order.items.filter(i => i.item.kitchen === "B");
    if (kitchenBItems.length > 0) {
        await enqueuePrintJob("B", order, kitchenBItems);
    }
    return true;
}
