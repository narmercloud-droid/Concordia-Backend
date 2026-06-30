/**
 * Clear cached branch list (customer:branches:v1) from Redis.
 * Usage: node scripts/bust-branch-list-cache.mjs
 */
import "dotenv/config";
import { createClient } from "redis";

const url = String(process.env.REDIS_URL ?? "").trim();
if (!url.startsWith("redis://")) {
  console.error("REDIS_URL not configured — run on Render shell or wait ~30 min for cache TTL.");
  process.exit(1);
}

const client = createClient({ url });
await client.connect();
const deleted = await client.del("customer:branches:v1");
console.log(`Deleted customer:branches:v1 from Redis (${deleted} key(s))`);
await client.quit();
