#!/usr/bin/env node
/**
 * Stripe production setup helper for Concordia.
 *
 * Usage:
 *   node scripts/setup-stripe-payments.mjs
 *   node scripts/setup-stripe-payments.mjs --validate-domains
 *
 * Requires in .env (or environment):
 *   STRIPE_SECRET_KEY
 * Optional:
 *   FRONTEND_URL (default https://www.concordiapizza.de)
 *   RENDER_BACKEND_URL (default https://concordia-backend-web.onrender.com)
 */
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "https://www.concordiapizza.de";
const BACKEND_URL = process.env.RENDER_BACKEND_URL || "https://concordia-backend-web.onrender.com";
const WEBHOOK_PATH = "/api/stripe/webhook";

function hostnameFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

const DOMAINS = Array.from(
  new Set(
    [
      hostnameFromUrl(FRONTEND_URL),
      "www.concordiapizza.de",
      "concordiapizza.de",
      "concordia-restaurant-de.vercel.app"
    ].filter(Boolean)
  )
);

async function ensurePaymentMethodDomain(stripe, domainName) {
  const existing = await stripe.paymentMethodDomains.list({ limit: 100 });
  const found = existing.data.find((d) => d.domain_name === domainName);
  if (found) {
    return { domain: found, created: false };
  }
  const domain = await stripe.paymentMethodDomains.create({ domain_name: domainName });
  return { domain, created: true };
}

async function validateDomain(stripe, domain) {
  try {
    return await stripe.paymentMethodDomains.validate(domain.id);
  } catch (err) {
    return { error: err?.message ?? String(err), domain };
  }
}

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("Missing STRIPE_SECRET_KEY in environment or .env");
    process.exit(1);
  }
  if (secret.includes("YOUR_STR") || secret.includes("...")) {
    console.error(
      "STRIPE_SECRET_KEY looks like a placeholder. Set your real sk_test_ or sk_live_ key in .env first."
    );
    process.exit(1);
  }

  const stripe = new Stripe(secret);
  const validateOnly = process.argv.includes("--validate-domains");

  console.log("\n=== Concordia Stripe setup ===\n");
  console.log("Mode:", secret.startsWith("sk_live") ? "LIVE" : "TEST");
  console.log("Frontend:", FRONTEND_URL);
  console.log("Webhook URL:", `${BACKEND_URL}${WEBHOOK_PATH}`);
  console.log("Apple Pay file:", `${FRONTEND_URL}/.well-known/apple-developer-merchantid-domain-association`);
  console.log("");

  console.log("--- Render environment variables (Dashboard → concordia-backend-web → Environment) ---");
  console.log("STRIPE_SECRET_KEY=sk_live_...   (already in local .env)");
  console.log("STRIPE_PUBLISHABLE_KEY=pk_live_...   ← add this (Stripe Dashboard → Developers → API keys)");
  console.log("STRIPE_WEBHOOK_SECRET=whsec_...   (from webhook step below)");
  console.log("FRONTEND_URL=" + FRONTEND_URL);
  console.log("");

  console.log("--- Stripe Dashboard → Webhooks → Add endpoint ---");
  console.log("URL:", `${BACKEND_URL}${WEBHOOK_PATH}`);
  console.log("Events: payment_intent.succeeded, account.updated");
  console.log("☑ Listen to events on Connected accounts");
  console.log("Copy signing secret → STRIPE_WEBHOOK_SECRET on Render");
  console.log("");

  console.log("--- Payment method domains ---");
  for (const domainName of DOMAINS) {
    const { domain, created } = await ensurePaymentMethodDomain(stripe, domainName);
    const apple = domain.apple_pay?.status ?? "unknown";
    const google = domain.google_pay?.status ?? "unknown";
    console.log(
      `${created ? "Created" : "Exists"}: ${domainName} (apple_pay: ${apple}, google_pay: ${google})`
    );

    if (validateOnly) {
      const result = await validateDomain(stripe, domain);
      if (result.error) {
        console.log(`  Validate failed: ${result.error}`);
        console.log(
          "  → Host /.well-known/apple-developer-merchantid-domain-association on this domain, then re-run with --validate-domains"
        );
      } else {
        console.log(
          `  Validated: apple_pay=${result.apple_pay?.status}, google_pay=${result.google_pay?.status}`
        );
      }
    }
  }

  if (!validateOnly) {
    console.log("\nAfter deploying the Apple Pay file to Vercel, run:");
    console.log("  node scripts/setup-stripe-payments.mjs --validate-domains");
  }

  console.log("\n--- Branch Connect (per restaurant) ---");
  console.log("1. Login: https://www.concordiapizza.de/admin/platform-settings");
  console.log("2. Branch settings → Connect Stripe for Kempen / Straelen");
  console.log("3. Each branch completes its own bank details in Stripe Express");
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
