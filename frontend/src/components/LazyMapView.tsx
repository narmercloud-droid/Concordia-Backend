"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView.js"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-500">
      Loading map…
    </div>
  )
});

type LazyMapViewProps = {
  latitude: number;
  longitude: number;
};

export default function LazyMapView({ latitude, longitude }: LazyMapViewProps) {
  return <MapView latitude={latitude} longitude={longitude} />;
}
