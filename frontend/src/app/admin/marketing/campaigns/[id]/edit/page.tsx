"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api.js";

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [segmentId, setSegmentId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignData, segmentData] = await Promise.all([
          api.getCampaigns(),
          api.getSegments()
        ]);
        const found = (campaignData || []).find((item: any) => String(item.id) === params.id);
        if (!found) {
          setError("Campaign not found.");
          return;
        }
        setCampaign(found);
        setName(found.name || "");
        setDescription(found.description || "");
        setContent(found.content || "");
        setSegmentId(found.segmentId ? String(found.segmentId) : null);
        setScheduledFor(found.scheduledFor ? new Date(found.scheduledFor).toISOString().slice(0, 16) : "");
        setStatus(found.status || "draft");
        setSegments(segmentData || []);
      } catch (err: unknown) {
        setError("Unable to load campaign details.");
      }
    }
    loadData();
  }, [params.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !content) {
      setError("Campaign name and content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.updateCampaign(Number(params.id), {
        name,
        description,
        content,
        segmentId: segmentId ? Number(segmentId) : null,
        scheduledFor: scheduledFor || null,
        status
      });
      router.push("/admin/marketing");
    } catch (err: unknown) {
      setError("Unable to update campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.sendCampaignNow(Number(params.id));
      router.push("/admin/marketing");
    } catch (err: unknown) {
      setError("Unable to send campaign now.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Edit campaign</h1>
        <p className="mt-2 text-slate-600">Update content, segment, and schedule settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[140px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Segment</span>
          <select
            value={segmentId ?? ""}
            onChange={(e) => setSegmentId(e.target.value || null)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          >
            <option value="">No segment</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>{segment.name}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Schedule</span>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
            </select>
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save campaign"}
          </button>
          <button
            type="button"
            onClick={handleSendNow}
            disabled={loading}
            className="flex-1 rounded-3xl border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send now
          </button>
        </div>
      </form>
    </div>
  );
}
