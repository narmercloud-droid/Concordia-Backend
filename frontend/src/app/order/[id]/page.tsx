import OrderStatus from "../../../components/OrderStatus.js";
import { fetchOrder, fetchTrackDetails } from "../../../lib/serverApi.js";

type OrderPageProps = {
  params: { id: string };
};

export default async function OrderPage({ params }: OrderPageProps) {
  const orderData = await fetchOrder(params.id);
  const trackingToken = orderData?.tracking_token;
  const trackData = trackingToken ? await fetchTrackDetails(trackingToken) : null;
  const initialOrder = orderData?.order || orderData;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Track your order</h1>
        <p className="mt-2 text-slate-600">See the latest status for your delivery.</p>
        {trackingToken ? (
          <p className="mt-4 text-sm text-slate-600">
            Public tracking link:{" "}
            <a href={`/track/${trackingToken}`} className="font-semibold text-slate-900 hover:text-slate-700">
              /track/{trackingToken}
            </a>
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Tracking link is unavailable for this order.</p>
        )}
      </div>

      {trackData?.timeline ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Status timeline</h2>
          <div className="mt-4 space-y-3">
            {trackData.timeline.map((event: { id: string; status: string; timestamp: string }) => (
              <div key={event.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{event.status.replace(/_/g, " ")}</div>
                    <div className="text-sm text-slate-500">{new Date(event.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <OrderStatus orderId={params.id} initialOrder={initialOrder} />
    </div>
  );
}
