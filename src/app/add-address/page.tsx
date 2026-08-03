import { Navbar } from "@/components/navbar";
import { AddressForm } from "@/components/address-form";

export const metadata = { title: "Add delivery address | GreenCart" };

export default async function AddAddressPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-2xl px-4 py-12 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Delivery details</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">Where should we bring it?</h1><p className="mt-4 text-[#647566]">Save an address once, then choose it at checkout.</p><div className="mt-9"><AddressForm returnTo={returnTo} /></div></main></div>;
}
