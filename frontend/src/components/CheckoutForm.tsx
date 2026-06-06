"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api.js";
import { cart } from "../lib/cart.js";
import { formatCurrency } from "../lib/format.js";

export default function CheckoutForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [offerMessage, setOfferMessage] = useState<string | null>(null);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const router = useRouter();
  const items = cart.getCart();
  const total = cart.getTotal();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      setError("Your cart is empty. Add items before checking out.");
      return;
    }
    if (!name || !phone || !address) {
      setError("Please complete your name, phone, and address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (marketingConsent) {
        await api.updateMarketingPreferences({ marketingConsent: true, marketingEmail: true });
      }
      const response = await api.createOrder({
        customer: { name, phone, address },
        items,
        notes
      });

      const orderId = response.orderId || response.id || response.order?.id;
      if (!orderId) {
        throw new Error("Order id was not returned.");
      }

      cart.clearCart();
      router.push(`/order/${orderId}`);
    } catch (err) {
      setError("Unable to place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="Your name"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Phone</span>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="Contact number"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Delivery address</span>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="min-h-[110px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Street, city, and apartment details"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Special instructions</span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="min-h-[90px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Add any delivery notes or preferences"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Promo code</span>
          <div className="flex gap-3">
            <input
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="Enter promo code"
            />
            <button
              type="button"
              onClick={async () => {
                setOfferError(null);
                setOfferMessage(null);
                if (!promoCode.trim()) {
                  setOfferError("Enter a promo code to apply.");
                  return;
                }
                try {
                  const result = await api.validateOffer(promoCode.trim(), { total });
                  setDiscount(result.discount || 0);
                  setFreeDelivery(result.freeDelivery || false);
                  setOfferMessage(`Promo applied: ${formatCurrency(result.discount)} off${result.freeDelivery ? ", free delivery included" : ""}`);
                } catch (err: unknown) {
                  setDiscount(0);
                  setFreeDelivery(false);
                  setOfferError((err as Error)?.message || "Invalid promo code.");
                }
              }}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply
            </button>
          </div>
        </label>

        {offerMessage ? <p className="text-sm text-emerald-700">{offerMessage}</p> : null}
        {offerError ? <p className="text-sm text-red-600">{offerError}</p> : null}

        <label className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          <span className="text-sm text-slate-700">I agree to receive offers and updates.</span>
        </label>

        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.16em] text-slate-400">Order summary</div>
          <div className="mt-2 text-3xl font-semibold">{formatCurrency(total - discount)}</div>
          {discount > 0 ? (
            <p className="mt-2 text-sm text-slate-300">Discount applied: {formatCurrency(discount)}</p>
          ) : null}
          {freeDelivery ? <p className="mt-2 text-sm text-slate-300">Free delivery applied</p> : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
        >
          {loading ? "Placing your order…" : "Place my order"}
        </button>
      </form>
    </div>
  );
}
