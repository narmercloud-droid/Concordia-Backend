"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KDSOrderCard from "../../../components/KDSOrderCard.js";

type Order = {
  id: string;
  status: string;
  items: Array<{ id: string }>;
  customer?: { name?: string };
  createdAt: string;
};

function getCookie(name: string) {
  return document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.split("=")[1] || "";
}

export default function KDSOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async (branch: string) => {
    try {
      const response = await fetch(`http://localhost:3001/kds/orders/${encodeURIComponent(branch)}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to load orders");
      }
      setOrders(payload.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const branch = getCookie("kdsBranchId");
    if (!branch) {
      router.push("/kds/login");
      return;
    }
    setBranchId(branch);
    fetchOrders(branch);
    const interval = window.setInterval(() => fetchOrders(branch), 3000);
    return () => window.clearInterval(interval);
  }, [router]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Kitchen display</h1>
        <p className="mt-3 text-slate-600">Managing active orders for branch {branchId || "..."}.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">Loading orders…</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">{error}</div>
      ) : orders.length ? (
        <div className="grid gap-4">{orders.map(order => (<KDSOrderCard key={order.id} order={order} onClick={() => router.push(`/kds/orders/${order.id}`)} />))}</div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-slate-600">No active orders for this branch.</div>
      )}
    </div>
  );
}
