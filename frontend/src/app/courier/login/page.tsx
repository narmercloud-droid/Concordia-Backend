"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CourierLoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Please enter your courier email.");
      return;
    }

    localStorage.setItem("courierId", email.trim());
    router.push("/courier/orders");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Courier login</h1>
        <p className="mt-3 text-slate-600">Sign in with your email to access assigned deliveries.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Courier email
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
              placeholder="courier@example.com"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
