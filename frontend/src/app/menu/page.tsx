"use client";

import { useState } from "react";
import { cart } from "../../lib/cart.js";
import { formatCurrency } from "../../lib/format.js";
import MenuGrid from "../../components/MenuGrid.js";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

export default function MenuPage() {
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState<string | null>(null);

  const addToCart = () => {
    if (!selected) return;
    cart.addItem({
      id: selected.id,
      name: selected.name,
      price: selected.price,
      quantity,
    });
    setSuccess(`${selected.name} has been added to your cart.`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Menu</h1>
          <p className="mt-2 text-slate-600">Tap any dish to inspect ingredients, view pricing, and add it directly to your cart.</p>
        </div>
        <MenuGrid onSelect={item => {
          setSelected(item);
          setQuantity(1);
          setSuccess(null);
        }} />
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick order</h2>
          {selected ? (
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{selected.name}</div>
                <p className="mt-2 text-sm text-slate-500">{selected.description || "A delicious choice."}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Price</span>
                  <span>{formatCurrency(selected.price)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-700">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-2xl border border-slate-300 bg-white text-slate-900"
                    >
                      -
                    </button>
                    <span className="min-w-[2rem] text-center text-lg font-semibold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded-2xl border border-slate-300 bg-white text-slate-900"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={addToCart}
                className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Add to cart for {formatCurrency(selected.price * quantity)}
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">Select a menu item to see details and add it to your cart.</p>
          )}
        </div>
        {success ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
            {success}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
