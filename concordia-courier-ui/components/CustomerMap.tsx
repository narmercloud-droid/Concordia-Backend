"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function CustomerMap({ order }) {
  if (!order.courierLocation) {
    return <div className="p-4">Waiting for courier location…</div>;
  }

  const pos: [number, number] = [
    order.courierLocation.lat,
    order.courierLocation.lng
  ];

  return (
    <MapContainer
      center={pos}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={pos} />
    </MapContainer>
  );
}
