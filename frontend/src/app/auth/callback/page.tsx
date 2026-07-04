"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientBackendJson } from "../../../lib/clientBackend.js";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Verifying magic link...");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setError("Missing token in callback URL.");
        return;
      }

      try {
        const data = await clientBackendJson<{ token: string }>(`/api/auth/verify?token=${encodeURIComponent(token)}`);
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token })
        });

        if (!sessionResponse.ok) {
          throw new Error("Unable to store session cookie");
        }

        setMessage("Login successful. Redirecting…");
        window.location.replace("/");
      } catch (err: unknown) {
        setError("Verification failed. Please try logging in again.");
      }
    };

    verify();
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Signing you in</h1>
      <p className="mt-4 text-slate-600">{message}</p>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
