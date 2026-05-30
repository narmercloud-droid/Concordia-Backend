"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import Link from "next/link";

export default function TerminalDashboard({ params }) {
  const branchId = params.branchId;
  const [orders, setOrders] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/terminal/orders?branchId=${branchId}`)
      .then(res => res.json())
      .then(data => setOrders(data));

    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"]
    });

    s.emit("join_terminal_branch", branchId);
    setSocket(s);

    s.on("order_update", (order) => {
      setOrders((prev) => {
        const idx = prev.findIndex((o) => o.id === order.id);
        if (idx === -1) return [...prev, order];
        const updated = [...prev];
        updated[idx] = order;
        return updated;
      });
    });

    s.on("order_status", (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === data.orderId ? { ...o, status: data.status } : o
        )
      );
    });

    s.on("courier_location", (loc) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === loc.orderId
            ? { ...o, courierLocation: { lat: loc.lat, lng: loc.lng } }
            : o
        )
      );
    });

    return () => s.disconnect();
  }, [branchId]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Terminal — Branch {branchId}</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/terminal/${branchId}/${order.id}`}
            className="block p-4 bg-gray-100 rounded shadow"
          >
            <div className="font-semibold">Order #{order.id}</div>
            <div>Status: {order.status}</div>
            {order.courierLocation && (
              <div className="text-sm text-gray-600">
                Courier nearby: {order.courierLocation.lat.toFixed(5)}, {order.courierLocation.lng.toFixed(5)}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
