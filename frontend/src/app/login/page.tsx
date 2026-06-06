"use client";

import { useState } from "react";
import { api } from "../../lib/api.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    try {
      await api.requestMagicLink(email);
      setStatus("Magic link sent. Check your inbox.");
    } catch (err: unknown) {
      setError("Unable to send login link. Try again later.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Login with magic link</h1>
        <p className="mt-2 text-slate-600">Enter your email to receive a secure sign-in link.</p>
      </div>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-slate-700">Email address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          placeholder="you@example.com"
          required
        />
        <button
          type="submit"
          className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Send login link
        </button>
        {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
