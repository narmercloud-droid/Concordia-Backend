"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientBackendJson } from "../../../lib/clientBackend.js";

type Order = {
  id: string;
  status: string;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
};

export default function CourierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const courierId = localStorage.getItem("courierId");
    if (!courierId) {
      router.push("/courier/login");
      return;
    }

    clientBackendJson<{ orders?: Order[]; error?: string }>(`/courier/orders/${encodeURIComponent(courierId)}`)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setOrders(data.orders || []);
      })
      .catch(err => setError(err.message || "Unable to load orders."))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Assigned deliveries</h1>
        <p className="mt-3 text-slate-600">Your active orders are listed below. Tap an order to start tracking and send location updates.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">Loading your assigned orders…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">{error}</div>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} href={`/courier/orders/${order.id}`} className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Order {order.id}</div>
                  <p className="mt-2 text-slate-500">Status: {order.status}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{order.items.length} items</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-slate-600">No active deliveries assigned yet.</div>
      )}
    </div>
  );
}
