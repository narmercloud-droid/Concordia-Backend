import QRCode from "qrcode";
import { SunmiPrinter } from "../../printers/sunmiPrinter.js";
import { prisma } from "../../prisma/client.js";

const printer = new SunmiPrinter();

export class PrintService {
  static async printOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const pickupUrl = `https://YOUR_DOMAIN/api/v1/order/${order.id}/picked-up`;
    const qrBuffer = await QRCode.toBuffer(pickupUrl);

    await printer.printReceipt(order, qrBuffer);
  }
}




