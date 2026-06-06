"use client";

import CheckoutForm from "../../components/CheckoutForm.js";

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">Enter your details and submit your order.</p>
      </div>
      <CheckoutForm />
    </div>
  );
}
