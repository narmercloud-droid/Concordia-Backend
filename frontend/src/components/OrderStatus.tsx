"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { formatCurrency } from "../lib/format.js";

type OrderDetails = {
  id?: string;
  status?: string;
  items?: Array<{ id: string; name: string; quantity: number; price: number }>;
  total?: number;
  customer?: { name?: string; phone?: string; address?: string };
  notes?: string;
  placedAt?: string;
  [key: string]: any;
};

export default function OrderStatus({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getOrder(orderId)
      .then(data => {
        const resolved = data.order || data;
        setOrder(resolved);
      })
      .catch(() => setError("Unable to load order status."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading order status…</div>;
  }

  if (error || !order) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error || "Order not found."}</div>;
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Order tracker</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Order {order.id || order.orderId}</h1>
        <p className="mt-2 text-sm text-slate-500">Status: {order.status || "Pending"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Placed</p>
          <p className="mt-2 font-semibold text-slate-900">{order.placedAt ? new Date(order.placedAt).toLocaleString() : "Unknown"}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Customer</p>
          <p className="mt-2 font-semibold text-slate-900">{order.customer?.name || "Guest"}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-2 font-semibold text-slate-900">{order.total ? formatCurrency(order.total) : "—"}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Items</h2>
        <div className="mt-4 space-y-3">
          {(order.items || []).map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-3">
              <div>
                <div className="font-medium text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-500">Qty {item.quantity}</div>
              </div>
              <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>

      {order.notes ? (
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Delivery notes</div>
          <p className="mt-2">{order.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
