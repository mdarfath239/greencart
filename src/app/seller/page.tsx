import Link from "next/link";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { getAuthenticatedSeller } from "@/lib/seller-auth";

export const metadata = { title: "Seller dashboard | GreenCart" };

export default async function SellerPage() {
  if (!(await getAuthenticatedSeller())) redirect("/");
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Seller space</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Your market, growing.</h1><div className="mt-10 grid gap-5 sm:grid-cols-3"><Link href="/seller/add-product" className="rounded-[2rem] bg-[#1f6b39] p-7 text-white transition hover:-translate-y-1 hover:bg-[#15562d]"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c8e7ba]">Catalogue</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl">Add a product →</h2><p className="mt-3 text-sm text-[#e0f0d8]">List a fresh item with photos and prices.</p></Link><Link href="/seller/products" className="rounded-[2rem] border border-[#dce5d6] bg-white p-7 transition hover:-translate-y-1 hover:border-[#8caf7b]"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#5f9365]">Inventory</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl">Products →</h2><p className="mt-3 text-sm text-[#647566]">Control availability and keep shelves current.</p></Link><Link href="/seller/orders" className="rounded-[2rem] border border-[#dce5d6] bg-white p-7 transition hover:-translate-y-1 hover:border-[#8caf7b]"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#5f9365]">Fulfilment</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl">Orders →</h2><p className="mt-3 text-sm text-[#647566]">Move customer orders from packed to delivered.</p></Link></div></main></div>;
}
