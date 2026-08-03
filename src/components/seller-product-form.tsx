"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Fresh Fruits", "Vegetables", "Dairy", "Grains", "Bakery", "Beverages", "Snacks"];

export function SellerProductForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSaving(true);
    try {
      const response = await fetch("/api/products", { method: "POST", body: new FormData(event.currentTarget) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save product.");
      router.push("/seller"); router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save product.");
    } finally { setSaving(false); }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-[#cfddca] bg-[#fdfefc] px-4 py-3 text-sm outline-none transition focus:border-[#4d924f] focus:ring-4 focus:ring-[#d9ead3]";
  return <form onSubmit={onSubmit} className="rounded-[2rem] border border-[#dce5d6] bg-white p-6 shadow-[0_18px_55px_-45px_rgba(33,87,44,0.55)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2"><span className="text-sm font-bold text-[#38553e]">Product name</span><input required name="name" className={inputClass} placeholder="e.g. Organic spinach" /></label><label className="sm:col-span-2"><span className="text-sm font-bold text-[#38553e]">Description</span><textarea required name="description" minLength={8} className={`${inputClass} min-h-28 resize-y`} placeholder="What makes this product special?" /></label><label><span className="text-sm font-bold text-[#38553e]">Regular price (₹)</span><input required name="price" type="number" min="0" step="0.01" className={inputClass} /></label><label><span className="text-sm font-bold text-[#38553e]">Offer price (₹)</span><input required name="offer_price" type="number" min="0" step="0.01" className={inputClass} /></label><label><span className="text-sm font-bold text-[#38553e]">Category</span><select required name="category" defaultValue="" className={inputClass}><option value="" disabled>Select an aisle</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span className="text-sm font-bold text-[#38553e]">Images (up to 5)</span><input required name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-[#e7f0e1] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#266a38]`} /></label></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#9c4135]">{error}</p>}<button disabled={saving} className="mt-7 h-12 rounded-full bg-[#1f6b39] px-7 text-sm font-bold text-white hover:bg-[#15562d] disabled:cursor-not-allowed disabled:bg-[#9baba0]">{saving ? "Publishing…" : "Publish product"}</button></form>;
}
