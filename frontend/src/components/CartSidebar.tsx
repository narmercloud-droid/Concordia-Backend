"use client";

import { useEffect, useState } from "react";
import { cart } from "../lib/cart.js";
import { formatCurrency } from "../lib/format.js";

export default function CartSidebar() {
  const [cartItems, setCartItems] = useState(cart.getCart());
  const [total, setTotal] = useState(cart.getTotal());

  useEffect(() => {
    const unsubscribe = cart.subscribe(() => {
      setCartItems(cart.getCart());
      setTotal(cart.getTotal());
    });
    return unsubscribe;
  }, []);

  if (!cartItems.length) {
    return (
      <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-slate-900">Your cart</div>
        <p className="mt-3 text-sm text-slate-500">Add items from the menu to start an order.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="text-lg font-semibold text-slate-900">Your cart</div>
        <div className="mt-2 text-sm text-slate-500">Ready to checkout whenever you are.</div>
      </div>
      <div className="space-y-3">
        {cartItems.map(item => (
          <div key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-500">Qty {item.quantity}</div>
              </div>
              <div className="text-right text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-slate-950 px-4 py-3 text-white">
        <div className="flex items-center justify-between text-sm uppercase tracking-[0.16em] text-slate-400">Total</div>
        <div className="mt-2 text-2xl font-semibold">{formatCurrency(total)}</div>
      </div>
    </div>
  );
}
