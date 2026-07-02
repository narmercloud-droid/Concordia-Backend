import fetch from "node-fetch";
import type { BranchPayPalCredentials } from "./branchPayPal.service.ts";
import { getPayPalApiBase } from "./branchPayPal.service.ts";

async function getAccessToken(credentials: BranchPayPalCredentials) {
  const auth = Buffer.from(
    `${credentials.clientId}:${credentials.clientSecret}`
  ).toString("base64");

  const res = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!data.access_token) {
    throw new Error(data.error_description ?? "PayPal authentication failed");
  }
  return data.access_token;
}

export async function paypalRequest(
  path: string,
  method = "GET",
  body: unknown = null,
  credentials: BranchPayPalCredentials
) {
  const token = await getAccessToken(credentials);

  const res = await fetch(`${getPayPalApiBase()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
}
