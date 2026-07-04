import QRCode from "qrcode";
import { buildBranchOrderUrl } from "./customerOrderUrls.js";
export async function generateOrderQr(orderId, token) {
    const payload = `orderId=${orderId}&token=${token}`;
    return QRCode.toDataURL(payload);
}
export async function generateBranchOrderQrPng(branchId, size = 1024) {
    const url = buildBranchOrderUrl(branchId);
    return QRCode.toBuffer(url, {
        type: "png",
        width: size,
        margin: 2,
        errorCorrectionLevel: "H"
    });
}
export async function generateBranchOrderQrDataUrl(branchId, size = 512) {
    const url = buildBranchOrderUrl(branchId);
    return QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H"
    });
}
