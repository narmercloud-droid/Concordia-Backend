"use client";

import ItemCard from "./ItemCard.js";
import type { MenuItem } from "../lib/serverApi.js";

type MenuGridProps = {
  items: MenuItem[];
  error?: string | null;
  onSelect: (item: MenuItem) => void;
};

export default function MenuGrid({ items, error, onSelect }: MenuGridProps) {
  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">{error}</div>;
  }

  if (!items.length) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">No menu items available.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <ItemCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
