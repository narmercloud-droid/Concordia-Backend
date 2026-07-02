import { env } from "../../config/env.ts";
import { getOrCreateBranchPaymentSettings } from "./branchStripe.service.ts";

export type BranchPayPalCredentials = {
  clientId: string;
  clientSecret: string;
  webhookId: string | null;
};

export function isPayPalModeLive() {
  return env.PAYPAL_MODE === "live";
}

export function getPayPalApiBase() {
  return isPayPalModeLive()
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function getBranchPayPalCredentials(
  branchId: string
): Promise<BranchPayPalCredentials | null> {
  const settings = await getOrCreateBranchPaymentSettings(branchId);

  if (settings.paypalClientId && settings.paypalClientSecret) {
    return {
      clientId: settings.paypalClientId,
      clientSecret: settings.paypalClientSecret,
      webhookId: settings.paypalWebhookId ?? null
    };
  }

  if (env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET) {
    return {
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
      webhookId: env.PAYPAL_WEBHOOK_ID ?? null
    };
  }

  return null;
}

export function isBranchPayPalConfigured(credentials: BranchPayPalCredentials | null) {
  return Boolean(credentials?.clientId && credentials?.clientSecret);
}

export async function listBranchPayPalWebhookIds() {
  const { prisma } = await import("../../prisma/client.ts");
  const rows = await prisma.branchPaymentSettings.findMany({
    where: { paypalWebhookId: { not: null } },
    select: { paypalWebhookId: true }
  });
  const ids = rows
    .map((row) => row.paypalWebhookId)
    .filter((id): id is string => Boolean(id));
  if (env.PAYPAL_WEBHOOK_ID) ids.push(env.PAYPAL_WEBHOOK_ID);
  return [...new Set(ids)];
}

export async function updateBranchPayPalSettings(
  branchId: string,
  input: {
    paypalClientId?: string | null;
    paypalClientSecret?: string | null;
    paypalWebhookId?: string | null;
    paypalEnabled?: boolean;
  }
) {
  await getOrCreateBranchPaymentSettings(branchId);

  const data: Record<string, string | boolean | null> = {};
  if (input.paypalEnabled != null) data.paypalEnabled = input.paypalEnabled;
  if (input.paypalClientId !== undefined) {
    const trimmed = input.paypalClientId?.trim() ?? "";
    data.paypalClientId = trimmed || null;
  }
  if (input.paypalWebhookId !== undefined) {
    const trimmed = input.paypalWebhookId?.trim() ?? "";
    data.paypalWebhookId = trimmed || null;
  }
  if (input.paypalClientSecret !== undefined) {
    const trimmed = input.paypalClientSecret?.trim() ?? "";
    if (trimmed) data.paypalClientSecret = trimmed;
  }

  const { prisma } = await import("../../prisma/client.ts");
  return prisma.branchPaymentSettings.update({
    where: { branchId },
    data
  });
}

export async function getBranchPayPalAdminView(branchId: string) {
  const settings = await getOrCreateBranchPaymentSettings(branchId);
  const credentials = await getBranchPayPalCredentials(branchId);

  return {
    paypalEnabled: settings.paypalEnabled,
    paypalClientId: settings.paypalClientId,
    paypalWebhookId: settings.paypalWebhookId,
    paypalConfigured: isBranchPayPalConfigured(credentials),
    paypalSecretSet: Boolean(settings.paypalClientSecret)
  };
}
