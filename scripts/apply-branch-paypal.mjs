/**
 * Save per-branch PayPal REST app credentials from a local env file (never commit that file).
 *
 * Usage:
 *   node scripts/apply-branch-paypal.mjs concordia-kempen
 *
 * Reads credentials from .paypal-kempen.local.env (or .paypal-<branch>.local.env) in repo root.
 * Requires DATABASE_URL in .env (production Neon URL).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

dotenv.config({ path: resolve(root, ".env") });

const branchId = process.argv[2]?.trim();
if (!branchId) {
  console.error("Usage: node scripts/apply-branch-paypal.mjs <branchId>");
  console.error("Example: node scripts/apply-branch-paypal.mjs concordia-kempen");
  process.exit(1);
}

const suffix = branchId.replace(/^concordia-/, "");
const localPath = [
  resolve(root, `.paypal-${suffix}.local.env`),
  resolve(root, `.paypal-${branchId}.local.env`),
  resolve(root, ".paypal-kempen.local.env")
].find((p) => existsSync(p));

if (!localPath) {
  console.error(`Missing credentials file. Create .paypal-${suffix}.local.env in repo root.`);
  process.exit(1);
}

function parseEnvFile(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const creds = parseEnvFile(localPath);
const clientId = creds.PAYPAL_CLIENT_ID?.trim();
const clientSecret = creds.PAYPAL_CLIENT_SECRET?.trim();
const webhookId = creds.PAYPAL_WEBHOOK_ID?.trim();

if (!clientId || !clientSecret || !webhookId) {
  console.error("Credentials file must define PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add your Neon production URL to .env");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.findUnique({ where: { id: branchId }, select: { id: true, name: true } });
  if (!branch) {
    throw new Error(`Unknown branch: ${branchId}`);
  }

  await prisma.branchPaymentSettings.upsert({
    where: { branchId },
    create: {
      branchId,
      paypalClientId: clientId,
      paypalClientSecret: clientSecret,
      paypalWebhookId: webhookId,
      paypalEnabled: true
    },
    update: {
      paypalClientId: clientId,
      paypalClientSecret: clientSecret,
      paypalWebhookId: webhookId,
      paypalEnabled: true
    }
  });

  const mask = (value) => (value.length <= 8 ? "****" : `${value.slice(0, 4)}…${value.slice(-4)}`);
  console.log(`PayPal configured for ${branch.name} (${branchId})`);
  console.log(`  Client ID: ${mask(clientId)}`);
  console.log(`  Webhook ID: ${mask(webhookId)}`);
  console.log(`  Checkout: enabled`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
