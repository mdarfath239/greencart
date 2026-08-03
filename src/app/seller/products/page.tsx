import Link from "next/link";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { SellerProductsClient } from "@/components/seller-products-client";
import { getAuthenticatedSeller } from "@/lib/seller-auth";
import { getSellerProducts } from "@/lib/seller-data";

export const metadata = { title: "My products | GreenCart Seller" };

export default async function SellerProductsPage() {
  const seller = await getAuthenticatedSeller();
  if (!seller) redirect("/");
  const products = await getSellerProducts(seller.userId);
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Seller catalogue</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Your products</h1></div><Link href="/seller/add-product" className="rounded-full bg-[#1f6b39] px-5 py-3 text-sm font-bold text-white hover:bg-[#15562d]">Add product</Link></div><div className="mt-9"><SellerProductsClient initialProducts={products} /></div></main></div>;
}
