/**
 * Sync VAPID keys from .env to Render (concordia-backend-web).
 * Usage: RENDER_API_KEY=rnd_... node scripts/set-render-vapid.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

function loadEnvFile(path) {
  const text = readFileSync(path, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const apiKey = process.env.RENDER_API_KEY?.trim();
if (!apiKey) {
  console.error("Set RENDER_API_KEY (from https://dashboard.render.com/u/settings#api-keys)");
  process.exit(1);
}

const env = { ...process.env, ...loadEnvFile(envPath) };
const publicKey = env.VAPID_PUBLIC_KEY?.trim();
const privateKey = env.VAPID_PRIVATE_KEY?.trim();

if (!publicKey || !privateKey) {
  console.error("VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set in .env");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json"
};

const servicesRes = await fetch("https://api.render.com/v1/services?limit=50", { headers });
if (!servicesRes.ok) {
  console.error("Failed to list services:", servicesRes.status, await servicesRes.text());
  process.exit(1);
}

const services = await servicesRes.json();
const match = services.find((row) => row.service?.name === "concordia-backend-web");
const serviceId = match?.service?.id;

if (!serviceId) {
  console.error('Service "concordia-backend-web" not found on this Render account');
  process.exit(1);
}

const envRes = await fetch(`https://api.render.com/v1/services/${serviceId}/env-vars`, { headers });
if (!envRes.ok) {
  console.error("Failed to list env vars:", envRes.status, await envRes.text());
  process.exit(1);
}

const existing = await envRes.json();
const byKey = new Map(existing.map((row) => [row.envVar.key, row.envVar.value]));

for (const [key, value] of [
  ["VAPID_PUBLIC_KEY", publicKey],
  ["VAPID_PRIVATE_KEY", privateKey]
]) {
  if (byKey.get(key) === value) {
    console.log(`${key}: already set`);
    continue;
  }

  const putRes = await fetch(`https://api.render.com/v1/services/${serviceId}/env-vars/${key}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ value })
  });

  if (!putRes.ok) {
    const postRes = await fetch(`https://api.render.com/v1/services/${serviceId}/env-vars`, {
      method: "POST",
      headers,
      body: JSON.stringify({ envVar: { key, value } })
    });
    if (!postRes.ok) {
      console.error(`Failed to set ${key}:`, postRes.status, await postRes.text());
      process.exit(1);
    }
    console.log(`${key}: created`);
  } else {
    console.log(`${key}: updated`);
  }
}

const deployRes = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
  method: "POST",
  headers,
  body: JSON.stringify({ clearCache: "do_not_clear" })
});

if (!deployRes.ok) {
  console.error("Env updated but deploy trigger failed:", deployRes.status, await deployRes.text());
  process.exit(1);
}

console.log("Deploy triggered for concordia-backend-web");
