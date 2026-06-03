import fetch from "node-fetch";
import { fileURLToPath } from "url";

// Deployment verification script
// Usage: ts-node scripts/verifyDeployment.ts
// BASE_URL can be overridden via environment variable

const BASE = process.env.BASE_URL || "http://localhost:4000";
const API_KEY =
  process.env.SMOKE_API_KEY ||
  (process.env.API_KEYS ? process.env.API_KEYS.split(",")[0] : "") ||
  "";

async function call(path: string, options: any = {}) {
  const url = `${BASE}${path}`;
  const headers: Record<string, string> = options.headers || {};

  if (API_KEY) {
    headers["X-API-KEY"] = API_KEY;
  }

  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    return { ok: res.ok, status: res.status, body: text };
  } catch (err) {
    return { ok: false, status: 0, error: String(err) };
  }
}

async function run() {
  console.log("Verifying deployment at", BASE);

  const endpoints = ["/health", "/ready", "/version"];

  for (const ep of endpoints) {
    const result = await call(ep);

    console.log(`\n[${ep}] status=${result.status} ok=${result.ok}`);

    if (result.body) {
      try {
        console.log("body:", JSON.stringify(JSON.parse(result.body), null, 2));
      } catch {
        console.log("body (text):", result.body);
      }
    }

    if ((result as any).error) {
      console.log("error:", (result as any).error);
    }
  }

  console.log("\nVerification complete");
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  run().catch((e) => {
    console.error("verifyDeployment failed", e);
    process.exit(1);
  });
}
