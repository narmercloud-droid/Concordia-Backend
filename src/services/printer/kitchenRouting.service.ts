import { prisma } from "../../prisma/client.ts";
import { enqueuePrintJob } from "./printerQueue.service.ts";

export async function routeOrderToKitchens(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { item: true }
      }
    }
  });

  if (!order) return;

  const kitchenBItems = order.items.filter(i => i.item.kitchen === "B");

  if (kitchenBItems.length > 0) {
    await enqueuePrintJob("B", order, kitchenBItems);
  }

  return true;
}

