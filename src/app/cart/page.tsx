import { CartPageClient } from "@/components/cart-page-client";
import { Navbar } from "@/components/navbar";

export const metadata = { title: "Your cart | GreenCart" };

export default function CartPage() {
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Almost there</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Your cart</h1><div className="mt-9"><CartPageClient /></div></main></div>;
}
