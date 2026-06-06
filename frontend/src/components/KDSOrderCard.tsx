"use client";

type Order = {
  id: string;
  status: string;
  items: Array<{ id: string }>; 
  customer?: { name?: string };
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  ready_for_pickup: "bg-cyan-100 text-cyan-700",
  picked_up: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700"
};

function formatRelativeTime(dateString: string) {
  const ms = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function KDSOrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">Order {order.id}</div>
          <div className="mt-2 text-sm text-slate-500">{order.customer?.name || "Guest"}</div>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>
          {order.status.replace(/_/g, " ")}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{order.items.length} items</span>
        <span>•</span>
        <span>{formatRelativeTime(order.createdAt)}</span>
      </div>
    </button>
  );
}
