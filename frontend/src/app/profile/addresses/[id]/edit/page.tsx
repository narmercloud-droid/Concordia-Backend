"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../../lib/api.js";

export default function EditAddressPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadAddress() {
      try {
        const data = await api.getAddress(id);
        setLabel(data.label || "");
        setStreet(data.street || "");
        setCity(data.city || "");
        setPostalCode(data.postalCode || "");
        setInstructions(data.instructions || "");
      } catch {
        setError("Unable to load address details.");
      }
    }

    loadAddress();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await api.updateAddress(id, { label, street, city, postalCode, instructions });
      router.push("/profile/addresses");
    } catch (err: unknown) {
      setError("Unable to update address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit address</h1>
        <p className="mt-2 text-slate-600">Update your saved shipment address.</p>
      </div>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Label</span>
            <input value={label} onChange={e => setLabel(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500" placeholder="Home, Work" required />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>City</span>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500" placeholder="City" required />
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Street address</span>
          <input value={street} onChange={e => setStreet(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500" placeholder="123 Main St" required />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Postal code</span>
          <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500" placeholder="Postal code" required />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          <span>Instructions</span>
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="min-h-[110px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500" placeholder="Leave delivery notes (optional)" />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={saving || !id} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {saving ? "Updating…" : "Update address"}
        </button>
      </form>
    </div>
  );
}
