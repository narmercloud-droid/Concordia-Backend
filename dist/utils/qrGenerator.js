"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderQr = generateOrderQr;
const qrcode_1 = __importDefault(require("qrcode"));
async function generateOrderQr(orderId, token) {
    const payload = `orderId=${orderId}&token=${token}`;
    return qrcode_1.default.toDataURL(payload);
}
