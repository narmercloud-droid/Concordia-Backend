"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import KDSOrderDetail from "../../../../components/KDSOrderDetail.js";
import { clientBackendJson } from "../../../../lib/clientBackend.js";

type Order = {
  id: string;
  status: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; notes?: string | null; addOnIds: string[] }>;
  customer?: { name?: string; phone?: string; email?: string };
  createdAt: string;
  updatedAt: string;
  courierId?: string | null;
};

function getCookie(name: string) {
  return document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.split("=")[1] || "";
}

export default function KDSOrderDetailPage() {
  const params = useParams();
  const rawOrderId = params?.id;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  const router = useRouter();
  const [branchId, setBranchId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [courierId, setCourierId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOrder = async (branch: string) => {
    if (!orderId) return;
    try {
      const payload = await clientBackendJson<{ orders?: Order[]; error?: string }>(`/kds/orders/${encodeURIComponent(branch)}`, { cache: "no-store" });
      const found = (payload.orders || []).find((item: Order) => item.id === orderId);
      if (!found) {
        throw new Error("Order not found for this branch.");
      }
      setOrder(found);
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Unable to load order.");
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
  }, [router]);

  useEffect(() => {
    if (!branchId) return;
    fetchOrder(branchId);
    const interval = window.setInterval(() => fetchOrder(branchId), 10000);
    return () => window.clearInterval(interval);
  }, [branchId, orderId]);

  const updateStatus = async (status: string) => {
    if (!orderId) return;
    try {
      await clientBackendJson(`/kds/orders/${encodeURIComponent(orderId!)}/status`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
      setStatusMessage(`Order updated to ${status.replace(/_/g, " ")}.`);
      fetchOrder(branchId!);
    } catch (err: any) {
      setError(err.message || "Unable to update status.");
    }
  };

  const assignCourier = async () => {
    if (!orderId || !courierId.trim()) {
      setError("Enter a courier ID before assigning.");
      return;
    }

    try {
      await clientBackendJson(`/kds/orders/${encodeURIComponent(orderId!)}/assign-courier`, {
        method: "POST",
        body: JSON.stringify({ courierId: courierId.trim() })
      });
      setStatusMessage("Courier assigned successfully.");
      fetchOrder(branchId!);
    } catch (err: any) {
      setError(err.message || "Unable to assign courier.");
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10">Loading order details…</div>;
  }

  if (error || !order) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-red-700">{error || "Order not found."}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Order {order.id}</h1>
            <p className="mt-2 text-slate-600">Branch {branchId}</p>
          </div>
          <button onClick={() => router.push("/kds/orders")} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Back to orders
          </button>
        </div>
      </div>

      {statusMessage ? <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-700">{statusMessage}</div> : null}

      <KDSOrderDetail
        order={order}
        courierId={courierId}
        onCourierIdChange={setCourierId}
        onStatusUpdate={updateStatus}
        onAssignCourier={assignCourier}
      />
    </div>
  );
}
