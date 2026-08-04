"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Database } from "@/lib/database.types";
import { useCartStore } from "@/lib/cart-store";

type Address = Database["public"]["Tables"]["addresses"]["Row"];

export function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    fetch("/api/addresses")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load addresses.");
        setAddresses(payload.addresses);
        setAddressId(payload.addresses[0]?.id || "");
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load addresses."))
      .finally(() => setLoadingAddresses(false));
  }, []);

  async function placeOrder() {
    if (!addressId || !items.length) return;
    setError("");
    setPlacing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: addressId,
          items: items.map((item) => ({ product_id: item.id, qty: item.quantity })),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to place order.");
      clearCart();
      router.push(`/orders?placed=${payload.order.id}`);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to place order.");
    } finally {
      setPlacing(false);
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
        <p className="text-2xl font-medium text-gray-900">Your basket is empty.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dull">
          Shop the market
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <section className="rounded-lg border border-gray-300/60 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">1. Delivery address</p>
            <h2 className="mt-2 text-xl font-medium text-gray-900">Choose where it goes</h2>
          </div>
          <Link href="/add-address?returnTo=/checkout" className="rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10">
            + Add address
          </Link>
        </div>

        {loadingAddresses ? (
          <p className="py-10 text-sm text-gray-500">Loading your saved addresses…</p>
        ) : addresses.length ? (
          <div className="mt-6 space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${addressId === address.id ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/40"}`}
              >
                <input type="radio" name="address" value={address.id} checked={addressId === address.id} onChange={() => setAddressId(address.id)} className="mt-1 accent-primary" />
                <span className="text-sm leading-6 text-gray-700">
                  <strong className="block text-gray-900">{address.name} · {address.phone}</strong>
                  {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-gray-50 p-5 text-sm text-gray-600">No delivery address saved yet. Add one to continue.</div>
        )}

        <div className="mt-9 border-t border-gray-200 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">2. Payment</p>
          <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="font-medium text-gray-900">Cash on Delivery</p>
            <p className="mt-1 text-sm text-gray-600">Pay when your order arrives.</p>
          </div>
        </div>
      </section>

      <aside className="rounded-lg bg-primary/10 p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Order summary</p>
        <div className="mt-5 space-y-3 border-b border-primary/20 pb-5 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span>{item.name} <span className="text-gray-500">× {item.quantity}</span></span>
              <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-3xl font-bold text-gray-900">₹{total.toFixed(0)}</span>
        </div>
        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={!addressId || placing || loadingAddresses}
          onClick={placeOrder}
          className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {placing ? "Placing COD order…" : "Place COD order"}
        </button>
      </aside>
    </div>
  );
}
