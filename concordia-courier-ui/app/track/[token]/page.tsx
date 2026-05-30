"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../components/CustomerMap.js"), { ssr: false });

export default function TrackingPage({ params }) {
  const token = params.token;
  const [order, setOrder] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/track/${token}`)
      .then(res => res.json())
      .then(data => setOrder(data));

    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"]
    });

    s.emit("join_customer_tracking", token);
    setSocket(s);

    s.on("courier_location", (loc) => {
      setOrder((prev) => ({
        ...prev,
        courierLocation: loc
      }));
    });

    s.on("order_status", (status) => {
      setOrder((prev) => ({
        ...prev,
        status: status.status
      }));
    });

    s.on("tracking_update", (data) => {
      setOrder(data);
    });

    return () => s.disconnect();
  }, [token]);

  if (!order) return <div className="p-6 text-xl">Loading tracking…</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Order Tracking</h1>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Status</h2>
        <p className="text-lg">{order.status}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Timeline</h2>
        <ul className="list-disc ml-4">
          {order.timeline.map((e, idx) => (
            <li key={idx}>{e.status} — {new Date(e.createdAt).toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>

      <Map order={order} />
    </div>
  );
}
