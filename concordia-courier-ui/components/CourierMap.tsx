"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function CourierMap({ token }) {
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"]
    });

    socket.emit("join_courier_order", token);

    socket.on("courier_location", (data) => {
      setPos([data.lat, data.lng]);
    });

    return () => socket.disconnect();
  }, [token]);

  if (!pos) return <div className="p-4">Waiting for location…</div>;

  return (
    <MapContainer
      center={pos}
      zoom={16}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} />
    </MapContainer>
  );
}
