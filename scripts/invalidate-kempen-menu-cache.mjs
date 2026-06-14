/**
 * Invalidate Kempen menu cache after DB menu updates.
 */
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const BRANCH_ID = "concordia-kempen";
const MENU_LANGS = ["de", "en", "nl", "pl", "ru", "ro", "hi", "ar", "ku", "tr", "ckb"];

function loadEnv() {
  try {
    const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // ignore
  }
}

loadEnv();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error("REDIS_URL not set");
  process.exit(1);
}

const redis = createClient({ url: redisUrl });
await redis.connect();

const keys = [];
for (const lang of MENU_LANGS) {
  keys.push(`customer:menu:${BRANCH_ID}:${lang}:v2:json`);
}
keys.push(`customer:menu:${BRANCH_ID}:v1:json`);

let deleted = 0;
for (const key of keys) {
  if (await redis.del(key)) deleted++;
}

await redis.quit();
console.log(`Cleared ${deleted} menu cache keys for ${BRANCH_ID}.`);
