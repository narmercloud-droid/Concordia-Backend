import { createClient } from "redis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(resolve(root, ".env"), "utf8");
const env = {};
for (const line of envText.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  let val = trimmed.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[trimmed.slice(0, eq)] = val;
}

const url = env.REDIS_URL;
if (!url) {
  console.log("REDIS_URL not set — skip");
  process.exit(0);
}

const client = createClient({ url });
client.on("error", (err) => console.error("Redis error:", err.message));
await client.connect();

const langs = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku", "tr", "ckb"];
let deleted = 0;

for (const branchId of ["concordia-kempen", "concordia-straelen"]) {
  for (const lang of langs) {
    deleted += await client.del(`customer:menu:${branchId}:${lang}:v3:json`);
  }
  deleted += await client.del(`customer:menu:${branchId}:v1:json`);
  console.log("Cleared Redis menu cache for", branchId);
}

console.log("Deleted", deleted, "Redis key(s)");
await client.quit();
