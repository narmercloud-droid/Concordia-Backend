import QRCode from "qrcode";
import { buildBranchOrderUrl } from "./customerOrderUrls.ts";

export async function generateOrderQr(orderId: string, token: string) {
  const payload = `orderId=${orderId}&token=${token}`;
  return QRCode.toDataURL(payload);
}

export async function generateBranchOrderQrPng(
  branchId: string,
  size = 1024
): Promise<Buffer> {
  const url = buildBranchOrderUrl(branchId, { productionQr: true });
  return QRCode.toBuffer(url, {
    type: "png",
    width: size,
    margin: 2,
    errorCorrectionLevel: "H"
  });
}

export async function generateBranchOrderQrDataUrl(
  branchId: string,
  size = 512
): Promise<string> {
  const url = buildBranchOrderUrl(branchId, { productionQr: true });
  return QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "H"
  });
}
