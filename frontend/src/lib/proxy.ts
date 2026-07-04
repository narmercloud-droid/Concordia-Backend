import { cookies } from "next/headers";
import { getBackendUrl } from "./config.js";

export async function forwardToBackend(req: Request, backendPath: string) {
  const incoming = new URL(req.url);
  const normalizedPath = backendPath.replace(/^\//, "");
  const url = `${getBackendUrl()}/${normalizedPath}${incoming.search}`;

  const authToken = cookies().get("session")?.value;
  const headers = new Headers(req.headers);
  if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }
  headers.delete("host");

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  const response = await fetch(url, {
    method: req.method,
    headers,
    body
  });

  const responseBody = await response.text();
  return new Response(responseBody, {
    status: response.status,
    headers: response.headers
  });
}
