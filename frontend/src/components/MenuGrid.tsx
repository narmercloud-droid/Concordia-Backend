"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import ItemCard from "./ItemCard.js";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function MenuGrid({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getMenu()
      .then(response => setMenu(response.items || response || []))
      .catch(() => setError("Unable to load menu."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">Loading menu…</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {menu.map(item => (
        <ItemCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
