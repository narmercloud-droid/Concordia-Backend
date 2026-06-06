"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/CourierMap.js"), { ssr: false });

export default function CourierPage() {
  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courier/order?token=${token}`)
      .then(res => res.json())
      .then(data => setOrder(data));

    const s = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"]
    });

    s.emit("join_courier_order", token);
    setSocket(s);

    return () => s.disconnect();
  }, [token]);

  const sendLocation = () => {
    if (!navigator.geolocation || !token) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courier/location/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        })
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(sendLocation, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (!order) return <div className="p-6 text-xl">Loading order…</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Delivery #{order.orderId}</h1>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Customer</h2>
        <p>{order.customer.name}</p>
        <p>{order.customer.phone}</p>
        <p>{order.address.street}, {order.address.city}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Items</h2>
        {order.items.map((i, idx) => (
          <p key={idx}>{i.quantity}× {i.name}</p>
        ))}
      </div>

      <a
        href={order.navigationUrl}
        className="block bg-blue-600 text-white text-center py-3 rounded"
      >
        Navigate
      </a>

      <Map token={token} />
    </div>
  );
}
