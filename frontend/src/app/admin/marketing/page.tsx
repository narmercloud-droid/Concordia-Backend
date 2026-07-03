"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api.js";

export default function AdminMarketingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [campaignData, segmentData] = await Promise.all([
          api.getCampaigns(),
          api.getSegments()
        ]);
        setCampaigns(campaignData || []);
        setSegments(segmentData || []);
      } catch (err: unknown) {
        setError("Unable to load marketing data. Please sign in as admin and try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Marketing dashboard</h1>
            <p className="mt-2 text-slate-600">Manage campaign segmentation, scheduled sends, and offer strategy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/marketing/campaigns/new" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              New campaign
            </Link>
            <Link href="/admin/marketing/segments/new" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400">
              New segment
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Loading marketing overview…</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm text-red-700">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Campaigns</h2>
            {campaigns.length ? (
              <div className="mt-4 space-y-4">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{campaign.name}</p>
                        <p className="mt-1 text-sm text-slate-600">{campaign.status} • {campaign.segment?.name ?? "No segment"}</p>
                      </div>
                      <Link href={`/admin/marketing/campaigns/${campaign.id}/edit`} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">No campaigns created yet.</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Segments</h2>
              <Link href="/admin/marketing/segments" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                View all
              </Link>
            </div>
            {segments.length ? (
              <ul className="mt-4 space-y-3">
                {segments.map(segment => (
                  <li key={segment.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{segment.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{segment.filterJson}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-slate-600">No segments defined yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
