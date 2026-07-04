import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchCustomerOrders, fetchProfile } from "../../../lib/serverApi.js";

export default async function OrdersPage() {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect("/login");
  }

  const profile = await fetchProfile(session);
  const ordersData = await fetchCustomerOrders(profile.id, session);
  const orders = ordersData.orders || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Order history</h1>
        <p className="mt-2 text-slate-600">Review your recent purchases and track the status of each order.</p>
      </div>

      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Order {order.id}</div>
                  <div className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="text-lg font-semibold text-slate-900">€{order.items.reduce((sum:any, item:any) => sum + item.price * item.quantity, 0).toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{order.status}</span>
                <Link href={`/order/${order.id}`} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  View order
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          You have no orders yet. Place an order to get started.
        </div>
      )}
    </div>
  );
}
