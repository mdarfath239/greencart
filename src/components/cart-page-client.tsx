"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/lib/cart-store";

export function CartPageClient() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
        <p className="text-2xl font-medium text-gray-900">Your cart is empty.</p>
        <p className="mt-2 text-sm text-gray-500">Add items from the store to continue.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dull">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <section className="overflow-hidden rounded-lg border border-gray-300/60 bg-white">
        {items.map((item) => (
          <article key={item.id} className="flex gap-4 border-b border-gray-200 p-4 last:border-0 sm:gap-6 sm:p-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image src={item.image} alt={item.name} fill className="object-contain p-3" sizes="96px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="mt-1 text-sm text-gray-500">₹{item.price.toFixed(0)} each</p>
              <button type="button" onClick={() => removeItem(item.id)} className="mt-3 text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <div className="flex flex-col items-end justify-between">
              <p className="text-lg font-semibold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
              <div className="flex h-9 items-center rounded-full border border-gray-300 p-0.5">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100" aria-label={`Decrease ${item.name}`}>
                  −
                </button>
                <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100" aria-label={`Increase ${item.name}`}>
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
      <aside className="rounded-lg bg-primary/10 p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Order summary</p>
        <div className="mt-6 space-y-3 border-b border-primary/20 pb-5 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="font-medium text-primary">Free</span>
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-3xl font-bold text-gray-900">₹{subtotal.toFixed(0)}</span>
        </div>
        <Link href="/checkout" className="mt-7 flex h-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition hover:bg-primary-dull">
          Continue to checkout
        </Link>
        <p className="mt-4 text-center text-xs text-gray-500">Cash on delivery available.</p>
      </aside>
    </div>
  );
}
