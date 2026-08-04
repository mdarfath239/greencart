"use client";

import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

import { CartDrawer } from "@/components/cart-drawer";
import { CartHydrator } from "@/components/cart-hydrator";
import { useCartStore } from "@/lib/cart-store";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} className={`transition hover:text-primary ${active ? "font-medium text-gray-900" : "text-gray-700"}`}>
      {children}
    </Link>
  );
}

export function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const isSeller = hasHydrated && user?.publicMetadata?.role === "seller";

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-300 bg-white">
      <CartHydrator />
      <div className="flex items-center justify-between px-6 py-4 md:px-16 lg:px-24 xl:px-32">
        <Link href="/">
          <Image src="/images/logo.svg" alt="GreenCart logo" width={152} height={40} className="h-9 w-auto cursor-pointer md:h-10" style={{ width: "auto", height: "auto" }} priority />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/seller"
            className="rounded-full border border-gray-300 px-3 py-1 text-xs opacity-80 transition hover:border-primary hover:text-primary"
          >
            Seller Dashboard
          </Link>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">All Product</NavLink>

          <form onSubmit={handleSearchSubmit} className="flex max-lg:hidden items-center gap-2 rounded-full border border-gray-300 px-3 text-sm">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              className="w-44 bg-transparent py-1.5 outline-none placeholder:text-gray-500 lg:w-56"
            />
            <Search className="h-4 w-4 text-gray-500" />
          </form>

          <button type="button" onClick={() => setCartOpen(true)} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingCart className="h-6 w-6 text-gray-800 opacity-80" strokeWidth={1.5} />
            <span className="absolute -right-3 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-xs text-white">
              {hasHydrated ? itemCount : 0}
            </span>
          </button>

          {hasHydrated ? (
            <>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="cursor-pointer rounded-full bg-primary px-8 py-2 text-white transition hover:bg-primary-dull">
                    Login
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-3">
                  {isSeller && (
                    <Link href="/seller" className="text-sm font-medium text-primary hover:underline">
                      Seller
                    </Link>
                  )}
                  <Link href="/orders" className="text-sm text-gray-600 hover:text-primary">
                    Orders
                  </Link>
                  <UserButton />
                </div>
              </Show>
            </>
          ) : (
            <button className="cursor-pointer rounded-full bg-primary px-8 py-2 text-white transition hover:bg-primary-dull">
              Login
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 md:hidden">
          <button type="button" onClick={() => setCartOpen(true)} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingCart className="h-6 w-6 text-gray-800 opacity-80" strokeWidth={1.5} />
            <span className="absolute -right-3 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-xs text-white">
              {hasHydrated ? itemCount : 0}
            </span>
          </button>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" className="text-gray-800">
            {menuOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 px-6 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center gap-2 rounded-full border border-gray-300 px-3 text-sm">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent py-2 outline-none placeholder:text-gray-500"
            />
            <Search className="h-4 w-4 text-gray-500" />
          </form>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="/seller" onClick={() => setMenuOpen(false)} className="rounded-full border border-gray-300 px-3 py-2 text-center">
              Seller Dashboard
            </Link>
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)}>All Product</Link>
            <Link href="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            {hasHydrated ? (
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="rounded-full bg-primary px-4 py-2 text-white">Login</button>
                </SignInButton>
              </Show>
            ) : (
              <button className="rounded-full bg-primary px-4 py-2 text-white">Login</button>
            )}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
