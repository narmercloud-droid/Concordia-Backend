"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunmiPrinter = void 0;
const escpos_1 = __importDefault(require("escpos"));
const escpos_usb_1 = __importDefault(require("escpos-usb"));
class SunmiPrinter {
    constructor() {
        try {
            escpos_1.default.USB = escpos_usb_1.default;
            this.device = new escpos_1.default.USB();
            this.printer = new escpos_1.default.Printer(this.device);
        }
        catch (err) {
            console.warn("⚠ Sunmi printer not detected. Running in NO-PRINTER mode.");
            this.device = null;
            this.printer = null;
        }
    }
    print(text) {
        if (!this.printer) {
            console.warn("⚠ Print skipped: No Sunmi printer connected.");
            return;
        }
        this.device.open(() => {
            this.printer.text(text).cut().close();
        });
    }
    async printReceipt(order, qrBuffer) {
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
exports.SunmiPrinter = SunmiPrinter;
