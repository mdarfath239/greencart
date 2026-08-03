"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function SellerProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function toggleStock(product: Product) {
    setError(""); setSavingId(product.id);
    try {
      const response = await fetch("/api/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: product.id, in_stock: !product.in_stock }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to update stock.");
      setProducts((current) => current.map((item) => item.id === product.id ? payload.product : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to update stock."); }
    finally { setSavingId(null); }
  }

  if (!products.length) return <div className="rounded-[2rem] border border-dashed border-[#b7ceb1] bg-[#f1f6ee] px-6 py-20 text-center"><p className="font-[family-name:var(--font-display)] text-3xl">Your shelves are open.</p><p className="mt-3 text-sm text-[#647566]">Add your first product to start selling.</p><Link href="/seller/add-product" className="mt-6 inline-flex rounded-full bg-[#1f6b39] px-5 py-3 text-sm font-bold text-white">Add product</Link></div>;

  return <div>{error && <p role="alert" className="mb-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4135]">{error}</p>}<div className="overflow-hidden rounded-[2rem] border border-[#dce5d6] bg-white"><div className="hidden grid-cols-[1.7fr_0.75fr_0.75fr_0.85fr] gap-4 border-b border-[#dce5d6] bg-[#f5f8f2] px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#66806a] sm:grid"><span>Product</span><span>Offer price</span><span>Category</span><span>Availability</span></div>{products.map((product) => <article key={product.id} className="grid gap-4 border-b border-[#e4ebe0] px-5 py-5 last:border-0 sm:grid-cols-[1.7fr_0.75fr_0.75fr_0.85fr] sm:items-center sm:px-6"><div className="flex min-w-0 items-center gap-3"><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#edf5e9]"><Image src={product.image_urls[0] || "/images/apple_image.png"} alt="" fill className="object-contain p-1.5" sizes="48px" /></div><div className="min-w-0"><p className="truncate text-sm font-bold">{product.name}</p><p className="mt-1 text-xs text-[#728274]">₹{product.price.toFixed(0)} regular</p></div></div><p className="text-sm font-bold text-[#1f6b39]">₹{product.offer_price.toFixed(0)}</p><p className="text-sm text-[#5e7262]">{product.category}</p><button disabled={savingId === product.id} onClick={() => toggleStock(product)} className={`w-fit rounded-full px-3 py-2 text-xs font-bold transition disabled:opacity-50 ${product.in_stock ? "bg-[#e1f0db] text-[#26713a] hover:bg-[#cde4c3]" : "bg-[#f4e5df] text-[#9c493b] hover:bg-[#edd4cb]"}`}>{savingId === product.id ? "Saving…" : product.in_stock ? "In stock" : "Out of stock"}</button></article>)}</div></div>;
}
