import type Stripe from "stripe";
import { prisma } from "../../prisma/client.ts";
import { env } from "../../config/env.ts";
import { getStripe, getStripePublishableKey, isStripeConfigured } from "./stripeClient.ts";
import {
  createCustomerSessionForPayment,
  getOrCreateBranchStripeCustomer
} from "./customerStripePayment.service.ts";

export type BranchPaymentPublic = {
  stripeAccountId: string | null;
  stripeReady: boolean;
  cardEnabled: boolean;
  applePayEnabled: boolean;
  googlePayEnabled: boolean;
  paypalEnabled: boolean;
};

export async function getOrCreateBranchPaymentSettings(branchId: string) {
  const existing = await prisma.branchPaymentSettings.findUnique({ where: { branchId } });
  if (existing) return existing;

  return prisma.branchPaymentSettings.create({
    data: { branchId }
  });
}

function stripeErrorMessage(err: unknown) {
  const maybe = err as { message?: string; raw?: { message?: string } } | null;
  return maybe?.raw?.message ?? maybe?.message ?? "";
}

function isStaleStripeConnectAccountError(err: unknown) {
  const maybe = err as { code?: string; statusCode?: number } | null;
  const message = stripeErrorMessage(err).toLowerCase();

  if (maybe?.code === "resource_missing" || maybe?.statusCode === 404) return true;
  if (maybe?.code === "account_invalid" || maybe?.statusCode === 403) return true;
  if (message.includes("does not have access to account")) return true;
  if (message.includes("application access may have been revoked")) return true;

  return false;
}

async function clearBranchStripeLinkage(branchId: string) {
  return prisma.branchPaymentSettings.update({
    where: { branchId },
    data: {
      stripeAccountId: null,
      stripeChargesEnabled: false,
      stripeDetailsSubmitted: false,
      stripePayoutsEnabled: false,
      cardEnabled: false,
      applePayEnabled: false,
      googlePayEnabled: false
    }
  });
}

export async function syncBranchStripeAccount(branchId: string) {
  const settings = await getOrCreateBranchPaymentSettings(branchId);
  if (!settings.stripeAccountId || !isStripeConfigured()) {
    return settings;
  }

  const stripe = getStripe();
  let account: Stripe.Account;
  try {
    account = await stripe.accounts.retrieve(settings.stripeAccountId);
  } catch (err) {
    // Stale or inaccessible Connect accounts must not break admin settings loading.
    if (!isStaleStripeConnectAccountError(err)) {
      throw err;
    }

    return clearBranchStripeLinkage(branchId);
  }

  return prisma.branchPaymentSettings.update({
    where: { branchId },
    data: {
      stripeChargesEnabled: account.charges_enabled === true,
      stripeDetailsSubmitted: account.details_submitted === true,
      stripePayoutsEnabled: account.payouts_enabled === true
    }
  });
}

export async function getBranchPaymentPublic(branchId: string): Promise<BranchPaymentPublic> {
  const settings = await getOrCreateBranchPaymentSettings(branchId);
  const synced = settings.stripeAccountId ? await syncBranchStripeAccount(branchId) : settings;
  const stripeReady =
    Boolean(synced.stripeAccountId) &&
    synced.stripeChargesEnabled &&
    synced.stripeDetailsSubmitted;

  return {
    stripeAccountId: synced.stripeAccountId,
    stripeReady,
    cardEnabled: stripeReady && synced.cardEnabled,
    applePayEnabled: stripeReady && synced.applePayEnabled,
    googlePayEnabled: stripeReady && synced.googlePayEnabled,
    paypalEnabled: synced.paypalEnabled
  };
}

export async function createBranchConnectAccount(branchId: string) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured on the server");
  }

  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error("Branch not found");

  const settings = await getOrCreateBranchPaymentSettings(branchId);
  const stripe = getStripe();

  let accountId = settings.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      business_type: "company",
      metadata: { branchId, branchName: branch.name }
    });
    accountId = account.id;
    await prisma.branchPaymentSettings.update({
      where: { branchId },
      data: { stripeAccountId: accountId }
    });
  }

  return syncBranchStripeAccount(branchId);
}

export async function createBranchOnboardingLink(
  branchId: string,
  returnUrl: string,
  refreshUrl: string
) {
  const settings = await createBranchConnectAccount(branchId);
  if (!settings.stripeAccountId) {
    throw new Error("Could not create Stripe account for branch");
  }

  const stripe = getStripe();
  const link = await stripe.accountLinks.create({
    account: settings.stripeAccountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding"
  });

  return { url: link.url, stripeAccountId: settings.stripeAccountId };
}

export async function updateBranchPaymentFlags(
  branchId: string,
  input: Partial<{
    cardEnabled: boolean;
    applePayEnabled: boolean;
    googlePayEnabled: boolean;
    paypalEnabled: boolean;
  }>
) {
  await getOrCreateBranchPaymentSettings(branchId);
  return prisma.branchPaymentSettings.update({
    where: { branchId },
    data: {
      ...(input.cardEnabled != null ? { cardEnabled: input.cardEnabled } : {}),
      ...(input.applePayEnabled != null ? { applePayEnabled: input.applePayEnabled } : {}),
      ...(input.googlePayEnabled != null ? { googlePayEnabled: input.googlePayEnabled } : {}),
      ...(input.paypalEnabled != null ? { paypalEnabled: input.paypalEnabled } : {})
    }
  });
}

async function registerApplePayDomainForAccount(stripeAccountId: string) {
  if (!env.FRONTEND_URL) return;
  try {
    const hostname = new URL(env.FRONTEND_URL).hostname;
    const stripe = getStripe();

    const pmdList = await stripe.paymentMethodDomains.list({ limit: 100 });
    if (!pmdList.data.some((d) => d.domain_name === hostname)) {
      await stripe.paymentMethodDomains.create({ domain_name: hostname });
    }

    const existing = await stripe.applePayDomains.list(
      { limit: 10 },
      { stripeAccount: stripeAccountId }
    );
    if (!existing.data.some((d) => d.domain_name === hostname)) {
      await stripe.applePayDomains.create(
        { domain_name: hostname },
        { stripeAccount: stripeAccountId }
      );
    }
  } catch {
    // Domain file must be hosted at /.well-known/… — see scripts/setup-stripe-payments.mjs
  }
}

function amountToCents(amount: number) {
  return Math.round(amount * 100);
}

function buildAutomaticPaymentMethods(settings: {
  cardEnabled: boolean;
  applePayEnabled: boolean;
  googlePayEnabled: boolean;
}) {
  if (!settings.cardEnabled && !settings.applePayEnabled && !settings.googlePayEnabled) {
    return undefined;
  }
  return { enabled: true as const, allow_redirects: "never" as const };
}

export async function createOrderStripePaymentIntent(
  orderId: string,
  options?: { authenticatedCustomerId?: string | null }
) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "paid") throw new Error("Order is already paid");

  const payment = await getBranchPaymentPublic(order.branchId);
  if (!payment.stripeReady || !payment.stripeAccountId) {
    throw new Error("Online card payments are not enabled for this branch");
  }

  const amount = Number(order.orderTotal ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid order amount");
  }

  const stripe = getStripe();
  await registerApplePayDomainForAccount(payment.stripeAccountId);

  let stripeCustomerId: string | undefined;
  let customerSessionClientSecret: string | null = null;

  if (
    order.customerId &&
    options?.authenticatedCustomerId &&
    order.customerId === options.authenticatedCustomerId
  ) {
    stripeCustomerId = await getOrCreateBranchStripeCustomer(
      order.customerId,
      order.branchId,
      payment.stripeAccountId
    );
    try {
      customerSessionClientSecret = await createCustomerSessionForPayment(
        stripeCustomerId,
        payment.stripeAccountId
      );
    } catch (err) {
      console.warn("[stripe] customer session unavailable", orderId, err);
    }
  }

  const intentParams: Stripe.PaymentIntentCreateParams = {
    amount: amountToCents(amount),
    currency: "eur",
    automatic_payment_methods: buildAutomaticPaymentMethods(payment),
    metadata: {
      type: "order",
      orderId,
      branchId: order.branchId
    }
  };

  if (stripeCustomerId) {
    intentParams.customer = stripeCustomerId;
    intentParams.setup_future_usage = "off_session";
  }

  const intent = await stripe.paymentIntents.create(intentParams, {
    stripeAccount: payment.stripeAccountId
  });

  if (!intent.client_secret) {
    throw new Error("Failed to create payment session");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentIntentId: intent.id,
      paymentMethod: "CARD"
    }
  });

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    stripeAccountId: payment.stripeAccountId,
    publishableKey: getStripePublishableKey(),
    customerSessionClientSecret,
    savePaymentMethodOffered: Boolean(stripeCustomerId)
  };
}

export async function createGiftCardStripePaymentIntent(purchaseId: string) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const card = await prisma.branchGiftCard.findUnique({ where: { id: purchaseId } });
  if (!card) throw new Error("Gift card purchase not found");
  if (card.paymentStatus === "paid") throw new Error("Gift card is already paid");

  const payment = await getBranchPaymentPublic(card.branchId);
  if (!payment.stripeReady || !payment.stripeAccountId) {
    throw new Error("Online card payments are not enabled for this branch");
  }

  const amount = Number(card.initialAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid gift card amount");
  }

  const stripe = getStripe();
  await registerApplePayDomainForAccount(payment.stripeAccountId);

  const intent = await stripe.paymentIntents.create(
    {
      amount: amountToCents(amount),
      currency: "eur",
      automatic_payment_methods: buildAutomaticPaymentMethods(payment),
      metadata: {
        type: "gift_card",
        purchaseId,
        branchId: card.branchId
      }
    },
    { stripeAccount: payment.stripeAccountId }
  );

  if (!intent.client_secret) {
    throw new Error("Failed to create payment session");
  }

  await prisma.branchGiftCard.update({
    where: { id: purchaseId },
    data: { stripePaymentIntentId: intent.id }
  });

  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    stripeAccountId: payment.stripeAccountId,
    publishableKey: getStripePublishableKey()
  };
}

export async function confirmStripePaymentIntent(
  paymentIntentId: string,
  stripeAccountId: string
) {
  const stripe = getStripe();
  return stripe.paymentIntents.retrieve(
    paymentIntentId,
    {},
    { stripeAccount: stripeAccountId }
  );
}

export function getStripeWebhookSecret() {
  return env.STRIPE_WEBHOOK_SECRET ?? null;
}

export type StripeWebhookContext = {
  event: Stripe.Event;
};
