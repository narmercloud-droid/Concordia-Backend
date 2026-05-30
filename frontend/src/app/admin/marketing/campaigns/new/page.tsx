"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api.js";

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [segmentId, setSegmentId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [channelEmail, setChannelEmail] = useState(true);
  const [segments, setSegments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadSegments() {
      try {
        const segmentData = await api.getSegments();
        setSegments(segmentData || []);
      } catch (err: unknown) {
        console.error(err);
      }
    }
    loadSegments();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !content) {
      setError("Name and content are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createCampaign({
        name,
        description,
        content,
        segmentId: segmentId ? Number(segmentId) : null,
        scheduledFor: scheduledFor || null,
        channelEmail
      });
      router.push("/admin/marketing");
    } catch (err: unknown) {
      setError("Unable to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create campaign</h1>
        <p className="mt-2 text-slate-600">Set up a campaign and choose the target segment.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Campaign name"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Campaign details"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[140px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Email content or messaging"
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

        <label className="space-y-2 text-sm text-slate-700">
          <span>Schedule for</span>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-500"
          />
        </label>

        <label className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-slate-50 px-4 py-4">
          <input
            type="checkbox"
            checked={channelEmail}
            onChange={(e) => setChannelEmail(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          <span className="text-sm text-slate-700">Send via email</span>
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating campaign…" : "Create campaign"}
        </button>
      </form>
    </div>
  );
}
