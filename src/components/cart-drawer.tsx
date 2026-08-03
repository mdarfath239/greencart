"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/lib/cart-store";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close cart" onClick={onClose} className="absolute inset-0 cursor-default bg-[#17331f]/35 backdrop-blur-[1px]" />
      <aside aria-label="Shopping cart" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#fbfaf5] p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-[#dce5d6] pb-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Your basket</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl">A good haul.</h2></div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[#d2dfcd] text-xl hover:bg-white" aria-label="Close cart">×</button>
        </div>
        <div className="flex-1 overflow-y-auto py-5">
          {items.length ? items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-[#e4ebe0] py-4 first:pt-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eef5e9]"><Image src={item.image} alt="" fill className="object-contain p-2" sizes="64px" /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-[#6d7d70]">Qty {item.quantity}</p></div>
              <p className="text-sm font-bold text-[#1f6b39]">₹{(item.price * item.quantity).toFixed(0)}</p>
            </div>
          )) : <div className="pt-20 text-center"><p className="font-[family-name:var(--font-display)] text-3xl">Your basket is waiting.</p><p className="mt-3 text-sm text-[#66766a]">Add a few market favourites to begin.</p></div>}
        </div>
        <div className="border-t border-[#dce5d6] pt-5">
          <div className="flex justify-between text-sm"><span className="text-[#647566]">Subtotal</span><strong className="text-lg">₹{subtotal.toFixed(0)}</strong></div>
          <Link href="/cart" onClick={onClose} className="mt-5 flex h-12 items-center justify-center rounded-full bg-[#1f6b39] text-sm font-bold text-white hover:bg-[#15562d]">View cart</Link>
        </div>
      </aside>
    </div>
  );
}
