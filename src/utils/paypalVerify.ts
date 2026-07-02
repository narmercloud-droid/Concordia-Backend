import crypto from "crypto";
import fetch from "node-fetch";
import * as crc32 from "buffer-crc32";

export async function verifyPayPalWebhook(req: { headers: Record<string, string | string[] | undefined>; body: Buffer }, webhookId: string) {
  const headers = req.headers;

  const transmissionId = headers["paypal-transmission-id"];
  const timestamp = headers["paypal-transmission-time"];
  const certUrl = headers["paypal-cert-url"];
  const actualSignature = headers["paypal-transmission-sig"];
  const authAlgo = headers["paypal-auth-algo"];

  if (
    typeof transmissionId !== "string" ||
    typeof timestamp !== "string" ||
    typeof certUrl !== "string" ||
    typeof actualSignature !== "string" ||
    typeof authAlgo !== "string" ||
    !webhookId
  ) {
    return false;
  }

  const body = req.body;
  const expected = `${transmissionId}|${timestamp}|${webhookId}|${(crc32 as any)(body).toString("hex")}`;

  const cert = await fetch(certUrl).then((r) => r.text());
  const verifier = crypto.createVerify(authAlgo);
  verifier.update(expected);

  return verifier.verify(cert, actualSignature, "base64");
}

export async function verifyPayPalWebhookWithAnyId(
  req: { headers: Record<string, string | string[] | undefined>; body: Buffer },
  webhookIds: string[]
) {
  const unique = [...new Set(webhookIds.filter(Boolean))];
  for (const webhookId of unique) {
    if (await verifyPayPalWebhook(req, webhookId)) return true;
  }
  return false;
}
