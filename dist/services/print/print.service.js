"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const sunmiPrinter_1 = require("../../printers/sunmiPrinter");
const client_1 = require("../../prisma/client");
const printer = new sunmiPrinter_1.SunmiPrinter();
class PrintService {
    static async printOrder(orderId) {
        const order = await client_1.prisma.order.findUnique({
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
        const qrBuffer = await qrcode_1.default.toBuffer(pickupUrl);
        await printer.printReceipt(order, qrBuffer);
    }
}
exports.PrintService = PrintService;
