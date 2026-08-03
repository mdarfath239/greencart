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
    fetch("/api/addresses").then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to load addresses.");
      setAddresses(payload.addresses); setAddressId(payload.addresses[0]?.id || "");
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load addresses.")).finally(() => setLoadingAddresses(false));
  }, []);

  async function placeOrder() {
    if (!addressId || !items.length) return;
    setError(""); setPlacing(true);
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address_id: addressId, items: items.map((item) => ({ product_id: item.id, qty: item.quantity })) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to place order.");
      clearCart(); router.push(`/orders?placed=${payload.order.id}`); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to place order."); }
    finally { setPlacing(false); }
  }

  if (!items.length) return <div className="rounded-[2rem] border border-dashed border-[#b7ceb1] bg-[#f1f6ee] px-6 py-20 text-center"><p className="font-[family-name:var(--font-display)] text-3xl">Your basket is empty.</p><Link href="/products" className="mt-6 inline-flex rounded-full bg-[#1f6b39] px-5 py-3 text-sm font-bold text-white">Shop the market</Link></div>;
  return <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start"><section className="rounded-[2rem] border border-[#dce5d6] bg-white p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f9365]">1. Delivery address</p><h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl">Choose where it goes.</h2></div><Link href="/add-address?returnTo=/checkout" className="rounded-full border border-[#9dbe90] px-4 py-2 text-sm font-bold text-[#2b713c] hover:bg-[#eff6ec]">+ Add address</Link></div>{loadingAddresses ? <p className="py-10 text-sm text-[#68796a]">Loading your saved addresses…</p> : addresses.length ? <div className="mt-6 space-y-3">{addresses.map((address) => <label key={address.id} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${addressId === address.id ? "border-[#4d924f] bg-[#f0f7ec]" : "border-[#dce5d6] hover:border-[#a9c99d]"}`}><input type="radio" name="address" value={address.id} checked={addressId === address.id} onChange={() => setAddressId(address.id)} className="mt-1 accent-[#1f6b39]" /><span className="text-sm leading-6"><strong className="block">{address.name} · {address.phone}</strong>{address.street}, {address.city}, {address.state} {address.zip}, {address.country}</span></label>)}</div> : <div className="mt-6 rounded-2xl bg-[#f1f6ee] p-5 text-sm text-[#5d715f]">No delivery address saved yet. Add one to continue.</div>}<div className="mt-9 border-t border-[#e2ebe0] pt-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f9365]">2. Payment</p><div className="mt-3 rounded-2xl border border-[#9fc291] bg-[#f0f7ec] p-4"><p className="font-bold text-[#285e36]">Cash on Delivery</p><p className="mt-1 text-sm text-[#59735f]">Pay when your order arrives. Online payments can be added later.</p></div></div></section><aside className="rounded-[2rem] bg-[#e7f0e1] p-6 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Order summary</p><div className="mt-5 space-y-3 border-b border-[#bfd4b8] pb-5 text-sm">{items.map((item) => <div key={item.id} className="flex justify-between gap-4"><span>{item.name} <span className="text-[#748675]">× {item.quantity}</span></span><strong>₹{(item.price * item.quantity).toFixed(0)}</strong></div>)}</div><div className="mt-5 flex items-baseline justify-between"><span className="font-bold">Total</span><span className="font-[family-name:var(--font-display)] text-3xl font-bold">₹{total.toFixed(0)}</span></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4135]">{error}</p>}<button disabled={!addressId || placing || loadingAddresses} onClick={placeOrder} className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#1f6b39] text-sm font-bold text-white hover:bg-[#15562d] disabled:cursor-not-allowed disabled:bg-[#9baba0]">{placing ? "Placing COD order…" : "Place COD order"}</button></aside></div>;
}
