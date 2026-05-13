import QRCode from "qrcode";
export async function generateOrderQr(orderId, token) {
    const payload = `orderId=${orderId}&token=${token}`;
    return QRCode.toDataURL(payload);
}
