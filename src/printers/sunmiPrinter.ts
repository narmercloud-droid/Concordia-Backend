import escpos from "escpos";
import escposUSB from "escpos-usb";

export class SunmiPrinter {
  private device: any;
  private printer: any;

  constructor() {
    try {
      escpos.USB = escposUSB;
      this.device = new escpos.USB();
      this.printer = new escpos.Printer(this.device);
    } catch (err) {
      console.warn("⚠ Sunmi printer not detected. Running in NO-PRINTER mode.");
      this.device = null;
      this.printer = null;
    }
  }

  print(text: string) {
    if (!this.printer) {
      console.warn("⚠ Print skipped: No Sunmi printer connected.");
      return;
    }

    this.device.open(() => {
      this.printer.text(text).cut().close();
    });
  }

  async printReceipt(order: any, qrBuffer: Buffer) {
    if (!this.printer) {
      console.warn("⚠ Print skipped: No Sunmi printer connected.");
      return;
    }

    this.device.open(() => {
      this.printer
        .align("ct")
        .text("ORDER RECEIPT")
        .text("------------------------")
        .align("lt")
        .text(`Order ID: ${order.id}`)
        .text(`Customer: ${order.customerName || "N/A"}`)
        .text(`Total: $${order.total}`)
        .text("------------------------")
        .text("Items:");

      for (const item of order.items) {
        this.printer.text(`- ${item.name} x${item.quantity}`);
      }

      this.printer
        .text("------------------------")
        .align("ct")
        .image(qrBuffer, "d24")
        .cut()
        .close();
    });
  }
}
