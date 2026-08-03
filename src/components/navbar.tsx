"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

import { CartDrawer } from "@/components/cart-drawer";
import { CartHydrator } from "@/components/cart-hydrator";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  return (
    <header className="sticky top-0 z-30 border-b border-[#dbe5d6]/80 bg-[#fbfaf5]/90 backdrop-blur">
      <CartHydrator />
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.06em] text-[#1e713a]">
          Green<span className="text-[#24442d]">Cart</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#405643] md:flex">
          <Link href="/" className="hover:text-[#1f6b39]">Home</Link>
          <Link href="/products" className="hover:text-[#1f6b39]">Shop</Link>
          <Link href="/orders" className="hover:text-[#1f6b39]">My orders</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="rounded-full border border-[#d7e2d2] bg-white px-4 py-2 text-sm font-bold text-[#245032] transition hover:border-[#8caf7b]">
            Cart <span className="ml-1 text-[#398448]">{itemCount}</span>
          </button>
          <Show when="signed-out"><SignInButton><button className="rounded-full bg-[#1f6b39] px-4 py-2 text-sm font-bold text-white hover:bg-[#15562d]">Sign in</button></SignInButton></Show>
          <Show when="signed-in"><UserButton /></Show>
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
