"use client";

import { useEffect, useState } from "react";
import LazyMapView from "../../../components/LazyMapView.js";

type TrackingEvent = {
  id: string;
  status: string;
  timestamp: string;
};

type TrackingData = {
  order: {
    id: string;
    status: string;
    tracking_token: string;
    customerName: string;
    customerPhone: string | null;
    customerEmail: string | null;
    items: Array<{ id: string; name: string; quantity: number; price: number }>;
    createdAt: string;
  };
  latestLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    createdAt: string;
  } | null;
  timeline: TrackingEvent[];
};

export default function TrackPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTracking = async () => {
    try {
      const response = await fetch(`http://localhost:3001/track/${encodeURIComponent(params.token)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load tracking data");
      }
      setData(payload);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unable to load tracking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = window.setInterval(fetchTracking, 5000);
    return () => window.clearInterval(interval);
  }, [params.token]);

  const estimateEta = () => {
    if (!data) return "Calculating...";
    if (data.order.status === "delivered") return "Delivered";
    if (data.order.status === "out_for_delivery") return "5-10 min";
    if (data.order.status === "picked_up") return "10-15 min";
    return "15-25 min";
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Live order tracking</h1>
        <p className="mt-3 text-slate-600">Track your delivery with live courier location and status updates.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">Loading tracking information…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">{error}</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Order</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{data.order.id}</p>
              <p className="mt-2 text-slate-600">Status: {data.order.status}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">ETA</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{estimateEta()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Courier location</p>
              <p className="mt-3 text-slate-600">{data.latestLocation ? `${data.latestLocation.latitude.toFixed(5)}, ${data.latestLocation.longitude.toFixed(5)}` : "Waiting for courier"}</p>
            </div>
          </div>

          {data.latestLocation ? (
            <LazyMapView latitude={data.latestLocation.latitude} longitude={data.latestLocation.longitude} />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">The courier has not shared a location yet.</div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Status timeline</h2>
            <div className="mt-4 space-y-3">
              {data.timeline.length ? data.timeline.map(event => (
                <div key={event.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-900">{event.status}</div>
                      <div className="text-sm text-slate-500">{new Date(event.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500">No tracking events yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
