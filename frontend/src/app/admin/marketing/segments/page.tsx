"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api.js";

export default function MarketingSegmentsPage() {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSegments() {
      try {
        const segmentData = await api.getSegments();
        setSegments(segmentData || []);
      } catch (err: unknown) {
        setError("Unable to load segments.");
      } finally {
        setLoading(false);
      }
    }

    loadSegments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Segments</h1>
          <p className="mt-2 text-slate-600">Manage customer segments for campaigns and targeting.</p>
        </div>
        <Link href="/admin/marketing/segments/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          New segment
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading segments…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm text-red-700">{error}</div>
      ) : segments.length ? (
        <div className="grid gap-4">
          {segments.map(segment => (
            <div key={segment.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-900">{segment.name}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">ID {segment.id}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{segment.filterJson}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">No segments have been defined yet.</p>
        </div>
      )}
    </div>
  );
}
