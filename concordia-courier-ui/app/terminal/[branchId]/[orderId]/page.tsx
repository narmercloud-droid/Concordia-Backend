"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../../../components/TerminalMap.js"), { ssr: false });

export default function TerminalOrderDetails({ params }) {
  const { branchId, orderId } = params;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/terminal/order/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data));

    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"]
    });

    s.emit("join_terminal_branch", branchId);

    s.on("order_update", (data) => {
      if (data.id === orderId) setOrder(data);
    });

    s.on("order_status", (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) => ({ ...prev, status: data.status }));
      }
    });

    s.on("courier_location", (loc) => {
      if (loc.orderId === orderId) {
        setOrder((prev) => ({
          ...prev,
          courierLocation: { lat: loc.lat, lng: loc.lng }
        }));
      }
    });

    return () => s.disconnect();
  }, [branchId, orderId]);

  if (!order) return <div className="p-6 text-xl">Loading…</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order #{orderId}</h1>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Status</h2>
        <p>{order.status}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Items</h2>
        {order.items.map((i, idx) => (
          <p key={idx}>{i.quantity}× {i.item.name}</p>
        ))}
      </div>

      <Map order={order} />
    </div>
  );
}
