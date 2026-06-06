"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MapView from "../../../../components/MapView.js";

type Order = {
  id: string;
  status: string;
  createdAt: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
};

export default function CourierOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trackingActive, setTrackingActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const latestPositionRef = useRef<GeolocationPosition | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const courierId = localStorage.getItem("courierId");
    if (!courierId) {
      router.push("/courier/login");
      return;
    }

    fetch(`http://localhost:3001/courier/orders/${encodeURIComponent(courierId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const found = (data.orders || []).find((item: Order) => item.id === orderId);
        if (!found) {
          throw new Error("Order not found");
        }
        setOrder(found);
      })
      .catch(err => setError(err.message || "Unable to load order details."));
  }, [orderId, router]);

  useEffect(() => {
    if (!trackingActive) return;

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not available in your browser.");
      setTrackingActive(false);
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      position => {
        latestPositionRef.current = position;
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      },
      geoError => {
        setError(geoError.message || "Unable to track location.");
      },
      { enableHighAccuracy: true }
    );

    intervalRef.current = window.setInterval(() => {
      if (!latestPositionRef.current || !orderId) return;
      const coords = latestPositionRef.current.coords;
      fetch("http://localhost:3001/courier/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courierId: localStorage.getItem("courierId"),
          orderId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        })
      }).catch(() => {
        setStatusMessage("Unable to send GPS update.");
      });
    }, 5000);

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [trackingActive, orderId]);

  const startDelivery = () => {
    setError(null);
    setStatusMessage("Delivery tracking started.");
    setTrackingActive(true);
  };

  const sendStatus = async (status: string) => {
    if (!orderId) return;
    try {
      const response = await fetch("http://localhost:3001/courier/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStatusMessage(`Status updated to ${status}.`);
      if (status === "delivered") {
        setTrackingActive(false);
        if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current);
        if (intervalRef.current != null) window.clearInterval(intervalRef.current);
      }
    } catch (err: any) {
      setError(err.message || "Unable to update status.");
    }
  };

  if (error) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-red-700">{error}</div>;
  }

  if (!order) {
    return <div className="mx-auto max-w-5xl px-4 py-10">Loading order…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Order {order.id}</h1>
            <p className="mt-2 text-slate-600">Status: {order.status}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={startDelivery} disabled={trackingActive} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              Start Delivery
            </button>
            <button onClick={() => sendStatus("picked_up")} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Picked up
            </button>
            <button onClick={() => sendStatus("delivered")} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">
              Delivered
            </button>
          </div>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-700">{statusMessage}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order details</h2>
          <div className="mt-4 space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-500">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">€{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Courier tracking</h2>
          <p className="mt-3 text-slate-600">GPS updates are sent every 5 seconds while tracking is active.</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Tracking status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{trackingActive ? "Active" : "Paused"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Last location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : "No location yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {location ? <MapView latitude={location.latitude} longitude={location.longitude} /> : null}
    </div>
  );
}
