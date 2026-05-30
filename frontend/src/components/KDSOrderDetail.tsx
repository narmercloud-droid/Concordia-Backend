"use client";

import { useState } from "react";
import { formatCurrency } from "../lib/format.js";

type Item = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string | null;
  addOnIds: string[];
};

type Order = {
  id: string;
  status: string;
  items: Item[];
  customer?: { name?: string; phone?: string; email?: string };
  createdAt: string;
  updatedAt: string;
  courierId?: string | null;
};

export default function KDSOrderDetail({
  order,
  onStatusUpdate,
  onAssignCourier,
  onCourierIdChange,
  courierId
}: {
  order: Order;
  courierId: string;
  onStatusUpdate: (status: string) => Promise<void>;
  onAssignCourier: () => Promise<void>;
  onCourierIdChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Order {order.id}</h1>
            <p className="mt-2 text-sm text-slate-500">Status: {order.status.replace(/_/g, " ")}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Created {new Date(order.createdAt).toLocaleString()}</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Customer</h2>
            <p className="mt-3 text-sm text-slate-700">{order.customer?.name || "Guest"}</p>
            <p className="mt-1 text-sm text-slate-500">{order.customer?.email || "No email"}</p>
            <p className="mt-1 text-sm text-slate-500">{order.customer?.phone || "No phone"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Courier</h2>
            <p className="mt-3 text-sm text-slate-700">{order.courierId || "Not assigned"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Items</h2>
        <div className="mt-4 space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="mt-1 text-sm text-slate-500">Qty {item.quantity}</div>
                  {item.addOnIds.length ? <div className="mt-2 text-sm text-slate-500">Add-ons: {item.addOnIds.join(", ")}</div> : null}
                  {item.notes ? <p className="mt-2 rounded-3xl bg-white p-3 text-sm text-slate-600">Note: {item.notes}</p> : null}
                </div>
                <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Kitchen actions</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => onStatusUpdate("accepted")} className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
            Accept
          </button>
          <button type="button" onClick={() => onStatusUpdate("preparing")} className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-400">
            Preparing
          </button>
          <button type="button" onClick={() => onStatusUpdate("ready_for_pickup")} className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
            Ready for pickup
          </button>
        </div>
        <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign courier ID</label>
              <input
                value={courierId}
                onChange={event => onCourierIdChange(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                placeholder="Enter courier ID"
              />
            </div>
            <button type="button" onClick={onAssignCourier} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Assign courier
            </button>
          </div>
          <p className="text-sm text-slate-500">Use courier assignment after the order is prepared and ready for pickup.</p>
        </div>
      </div>
    </div>
  );
}
