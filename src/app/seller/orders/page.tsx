import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { SellerOrdersClient } from "@/components/seller-orders-client";
import { getAuthenticatedSeller } from "@/lib/seller-auth";
import { getSellerOrders } from "@/lib/seller-data";

export const metadata = { title: "Orders | GreenCart Seller" };

export default async function SellerOrdersPage() {
  const seller = await getAuthenticatedSeller();
  if (!seller) redirect("/");
  const orders = await getSellerOrders(seller.userId);
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Seller fulfilment</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Customer orders</h1><div className="mt-9"><SellerOrdersClient initialOrders={orders} sellerId={seller.userId} /></div></main></div>;
}
