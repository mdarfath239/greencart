import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { SellerProductForm } from "@/components/seller-product-form";
import { getAuthenticatedSeller } from "@/lib/seller-auth";

export const metadata = { title: "Add product | GreenCart Seller" };

export default async function AddProductPage() {
  if (!(await getAuthenticatedSeller())) redirect("/");
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-2xl px-4 py-12 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Seller catalogue</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Add something good.</h1><p className="mt-4 text-[#647566]">Your customers will see the offer price first.</p><div className="mt-9"><SellerProductForm /></div></main></div>;
}
