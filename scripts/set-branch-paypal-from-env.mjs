/**
 * One-off: copy PayPal credentials from a local env file onto a branch.
 * Usage: node scripts/set-branch-paypal-from-env.mjs <branchId> <envFile>
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const branchId = process.argv[2];
const envFile = process.argv[3];

if (!branchId || !envFile) {
  console.error("Usage: node scripts/set-branch-paypal-from-env.mjs <branchId> <envFile>");
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(envFile), "utf8");
const vars = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}

const clientId = vars.PAYPAL_CLIENT_ID;
const clientSecret = vars.PAYPAL_CLIENT_SECRET;
const webhookId = vars.PAYPAL_WEBHOOK_ID;

if (!clientId || !clientSecret) {
  console.error("Env file must contain PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET");
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const row = await prisma.branchPaymentSettings.upsert({
    where: { branchId },
    create: {
      branchId,
      paypalClientId: clientId,
      paypalClientSecret: clientSecret,
      paypalWebhookId: webhookId ?? null,
      paypalEnabled: true
    },
    update: {
      paypalClientId: clientId,
      paypalClientSecret: clientSecret,
      paypalWebhookId: webhookId ?? null,
      paypalEnabled: true
    }
  });

  console.log(
    JSON.stringify(
      {
        branchId,
        paypalEnabled: row.paypalEnabled,
        paypalConfigured: Boolean(row.paypalClientId && row.paypalClientSecret),
        paypalClientIdPrefix: `${row.paypalClientId?.slice(0, 8)}...`,
        webhookId: row.paypalWebhookId
      },
      null,
      2
    )
  );
} finally {
  await prisma.$disconnect();
}
