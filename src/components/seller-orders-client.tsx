"use client";

import { useState } from "react";

import type { Database, OrderStatus } from "@/lib/database.types";
import { readOrderLines } from "@/lib/order-types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
const statuses: OrderStatus[] = ["Order Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

export function SellerOrdersClient({ initialOrders, sellerId }: { initialOrders: Order[]; sellerId: string }) {
  const [orders, setOrders] = useState(initialOrders);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function setStatus(id: string, status: OrderStatus) {
    setError(""); setSaving(id);
    try {
      const response = await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to update order.");
      setOrders((current) => current.map((order) => order.id === id ? payload.order : order));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update order."); }
    finally { setSaving(null); }
  }

  if (!orders.length) return <div className="rounded-[2rem] border border-dashed border-[#b7ceb1] bg-[#f1f6ee] px-6 py-20 text-center"><p className="font-[family-name:var(--font-display)] text-3xl">No orders to pack yet.</p><p className="mt-3 text-sm text-[#647566]">Customer orders will appear here when they include your products.</p></div>;
  return <div>{error && <p role="alert" className="mb-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4135]">{error}</p>}<div className="space-y-5">{orders.map((order) => { const lines = readOrderLines(order.items).filter((item) => item.seller_id === sellerId); return <article key={order.id} className="rounded-[2rem] border border-[#dce5d6] bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f9365]">Order #{order.id.slice(0, 8)}</p><p className="mt-2 text-sm text-[#68796a]">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })} · COD</p></div><select value={order.status} disabled={saving === order.id} onChange={(event) => setStatus(order.id, event.target.value as OrderStatus)} className="rounded-full border border-[#cfddca] bg-[#f7faf5] px-4 py-2 text-sm font-bold text-[#29653a] outline-none disabled:opacity-50">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="mt-5 border-t border-[#e5ece1] pt-4 text-sm">{lines.map((line) => <div key={line.product_id} className="flex justify-between py-1"><span>{line.name} <span className="text-[#758576]">× {line.qty}</span></span><strong>₹{(line.price * line.qty).toFixed(0)}</strong></div>)}</div></article>; })}</div></div>;
}
