import fetch from "node-fetch";
import { getPayPalApiBase } from "./branchPayPal.service.js";
async function getAccessToken(credentials) {
    const auth = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64");
    const res = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });
    const data = (await res.json());
    if (!data.access_token) {
        throw new Error(data.error_description ?? "PayPal authentication failed");
    }
    return data.access_token;
}
export async function paypalRequest(path, method = "GET", body = null, credentials) {
    const token = await getAccessToken(credentials);
    const res = await fetch(`${getPayPalApiBase()}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : null
    });
    const data = (await res.json());
    if (!res.ok) {
        const message = (typeof data.message === "string" && data.message) ||
            (typeof data.error_description === "string" && data.error_description) ||
            `PayPal request failed (${res.status})`;
        throw new Error(message);
    }
    return data;
}
