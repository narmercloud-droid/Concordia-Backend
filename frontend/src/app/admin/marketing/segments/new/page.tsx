"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api.js";

export default function NewSegmentPage() {
  const [name, setName] = useState("");
  const [filterJson, setFilterJson] = useState(`{
  "marketingEmail": true
}`);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      JSON.parse(filterJson);
    } catch (err) {
      setError("filterJson must be valid JSON.");
      return;
    }

    if (!name) {
      setError("Segment name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createSegment({ name, filterJson });
      router.push("/admin/marketing/segments");
    } catch (err: unknown) {
      setError("Unable to create segment. Please check the JSON and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">New segment</h1>
        <p className="mt-2 text-slate-600">Define a filtering rule that selects customers for campaign targeting.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Segment name"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Filter JSON</span>
          <textarea
            value={filterJson}
            onChange={(e) => setFilterJson(e.target.value)}
            className="min-h-[180px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500 font-mono text-sm"
          />
          <p className="text-xs text-slate-500">Example filters: {`{ "lastOrderDays": 30, "marketingEmail": true }`}</p>
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving segment…" : "Create segment"}
        </button>
      </form>
    </div>
  );
}
