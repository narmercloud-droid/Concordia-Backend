import Stripe from "stripe";
import { env } from "../../config/env.js";
let stripeClient = null;
export function isStripeConfigured() {
    return Boolean(env.STRIPE_SECRET_KEY);
}
export function getStripe() {
    if (!env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe is not configured");
    }
    if (!stripeClient) {
        stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
    }
    return stripeClient;
}
export function getStripePublishableKey() {
    return env.STRIPE_PUBLISHABLE_KEY ?? null;
}
