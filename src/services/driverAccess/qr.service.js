import QRCode from 'qrcode';

export async function generateDriverQrUrl({ orderId, token, expiresAt, signature }) {
  const url = `https://yourdomain.com/driver?o=${orderId}&t=${token}&e=${expiresAt}&s=${signature}`;
  return QRCode.toDataURL(url);
}
