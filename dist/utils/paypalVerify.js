import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
import crypto from "crypto";
import fetch from "node-fetch";
const crc32 = __require("buffer-crc32");
export async function verifyPayPalWebhook(req) {
    const headers = req.headers;
    const transmissionId = headers["paypal-transmission-id"];
    const timestamp = headers["paypal-transmission-time"];
    const certUrl = headers["paypal-cert-url"];
    const actualSignature = headers["paypal-transmission-sig"];
    const authAlgo = headers["paypal-auth-algo"];
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const body = req.body; // raw Buffer
    const expected = `${transmissionId}|${timestamp}|${webhookId}|${crc32(body).toString("hex")}`;
    const cert = await fetch(certUrl).then(r => r.text());
    const verifier = crypto.createVerify(authAlgo);
    verifier.update(expected);
    return verifier.verify(cert, actualSignature, "base64");
}
