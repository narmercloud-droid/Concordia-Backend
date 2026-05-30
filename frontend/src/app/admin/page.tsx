"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api.js";

type AdminProfile = {
  id: string;
  email: string;
  role: string;
  branchId: string;
};

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [orders, setOrders] = useState<number | null>(null);
  const [courierStatus, setCourierStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const profileResponse = await api.getAdminProfile();
        const user = profileResponse?.user ?? profileResponse;

        if (!user || !user.branchId) {
          throw new Error("Unauthorized");
        }

        setProfile(user);

        const [revenueData, ordersData, couriersData] = await Promise.all([
          api.getBranchRevenue(user.branchId),
          api.getBranchOrders(user.branchId),
          api.getBranchCouriers(user.branchId)
        ]);

        setRevenue(typeof revenueData === "number" ? revenueData : Number(revenueData ?? 0));
        setOrders(typeof ordersData === "number" ? ordersData : Number(ordersData ?? 0));

        const statusCounts: Record<string, number> = {};
        Array.isArray(couriersData) && couriersData.forEach((item: any) => {
          const status = item?.courierStatus || "unknown";
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        setCourierStatus(statusCounts);
      } catch (err: unknown) {
        setError("Unable to load admin dashboard. Please sign in from the admin login page.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const courierStatusEntries = useMemo(
    () => Object.entries(courierStatus).sort((a, b) => b[1] - a[1]),
    [courierStatus]
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-4 text-slate-600">Loading your dashboard data…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="text-slate-600">{error ?? "Please sign in to access the admin dashboard."}</p>
        <Link href="/admin/login" className="inline-flex rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Go to admin login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-600">Branch {profile.branchId} · Role {profile.role}</p>
          </div>
          <Link href="/admin/login" className="inline-flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Switch account
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Paid orders</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{revenue ?? 0}</p>
          <p className="mt-2 text-sm text-slate-600">Orders marked paid at this branch</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total orders</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{orders ?? 0}</p>
          <p className="mt-2 text-sm text-slate-600">All orders placed at this branch</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Courier activity</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{courierStatusEntries.reduce((sum, item) => sum + item[1], 0)}</p>
          <p className="mt-2 text-sm text-slate-600">Orders currently assigned or in transit</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Courier status</h2>
        {courierStatusEntries.length ? (
          <div className="mt-4 space-y-3">
            {courierStatusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-800">{status}</span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No courier activity has been detected yet.</p>
        )}
      </div>
    </div>
  );
}
