"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cart } from "../../lib/cart.js";
import { formatCurrency } from "../../lib/format.js";

export default function CartPage() {
  const [items, setItems] = useState(cart.getCart());
  const [total, setTotal] = useState(cart.getTotal());

  useEffect(() => {
    const unsubscribe = cart.subscribe(() => {
      setItems(cart.getCart());
      setTotal(cart.getTotal());
    });
    return unsubscribe;
  }, []);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add something tasty from the menu and it will appear here.</p>
        <Link href="/menu" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Cart summary</h1>
        <div className="mt-6 space-y-4">
          {items.map(item => (
            <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-500">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-[0.2em] text-slate-500">Total</span>
          <span className="text-2xl font-semibold text-slate-900">{formatCurrency(total)}</span>
        </div>
        <Link href="/checkout" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
