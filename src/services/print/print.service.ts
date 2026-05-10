import QRCode from "qrcode";
import { SunmiPrinter } from "../../printers/sunmiPrinter";
import { prisma } from "../../prisma/client";

const printer = new SunmiPrinter();

export class PrintService {
  static async printOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        items: {
          include: {
            item: true,
            variant: true,
            toppings: { include: { topping: true } },
            extras: { include: { extra: true } }
          }
        }
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const pickupUrl = `https://YOUR_DOMAIN/api/v1/order/${order.order_id}/picked-up`;

    const qrBuffer = await QRCode.toBuffer(pickupUrl);

    await printer.printReceipt(order, qrBuffer);
  }
}
