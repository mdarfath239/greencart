"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/lib/cart-store";

export function CartPageClient() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!items.length) {
    return <div className="rounded-[2rem] border border-dashed border-[#b7ceb1] bg-[#f1f6ee] px-6 py-24 text-center"><p className="font-[family-name:var(--font-display)] text-4xl">Your cart is empty.</p><p className="mt-3 text-[#647566]">The market is full of good ideas.</p><Link href="/products" className="mt-7 inline-flex rounded-full bg-[#1f6b39] px-6 py-3 text-sm font-bold text-white hover:bg-[#15562d]">Start shopping</Link></div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <section className="overflow-hidden rounded-[2rem] border border-[#dce5d6] bg-white">
        {items.map((item) => (
          <article key={item.id} className="flex gap-4 border-b border-[#e4ebe0] p-4 last:border-0 sm:gap-6 sm:p-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#eef5e9]"><Image src={item.image} alt={item.name} fill className="object-contain p-3" sizes="96px" /></div>
            <div className="min-w-0 flex-1"><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-[#5d715f]">₹{item.price.toFixed(0)} each</p><button onClick={() => removeItem(item.id)} className="mt-3 text-xs font-bold text-[#9a493a] hover:underline">Remove</button></div>
            <div className="flex flex-col items-end justify-between"><p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1f6b39]">₹{(item.price * item.quantity).toFixed(0)}</p><div className="flex h-9 items-center rounded-full border border-[#cfddca] p-0.5"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#edf5e9]" aria-label={`Decrease ${item.name}`}>−</button><span className="w-7 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#edf5e9]" aria-label={`Increase ${item.name}`}>+</button></div></div>
          </article>
        ))}
      </section>
      <aside className="rounded-[2rem] bg-[#e7f0e1] p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Order summary</p>
        <div className="mt-6 space-y-3 border-b border-[#bfd4b8] pb-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div><div className="flex justify-between"><span>Delivery</span><span className="font-bold text-[#28743c]">Free</span></div></div>
        <div className="mt-5 flex items-baseline justify-between"><span className="font-bold">Total</span><span className="font-[family-name:var(--font-display)] text-3xl font-bold">₹{subtotal.toFixed(0)}</span></div>
        <Link href="/checkout" className="mt-7 flex h-12 items-center justify-center rounded-full bg-[#1f6b39] text-sm font-bold text-white hover:bg-[#15562d]">Continue to checkout</Link>
        <p className="mt-4 text-center text-xs text-[#637867]">Cash on delivery available.</p>
      </aside>
    </div>
  );
}
