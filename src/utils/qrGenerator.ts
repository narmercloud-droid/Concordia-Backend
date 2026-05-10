import QRCode from "qrcode";

export async function generateOrderQr(orderId: string, token: string) {
  const payload = `orderId=${orderId}&token=${token}`;
  return QRCode.toDataURL(payload);
}
