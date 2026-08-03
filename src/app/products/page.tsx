import { Navbar } from "@/components/navbar";
import { ProductCatalog } from "@/components/product-catalog";
import { getAllProducts } from "@/lib/products";

export const metadata = { title: "Shop groceries | GreenCart" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const products = await getAllProducts();
  const filters = await searchParams;

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">The whole market</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em] sm:text-6xl">Your everyday shelf.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#647566]">Search bright produce, pantry essentials, and the comforts that keep a kitchen humming.</p>
        <div className="mt-10"><ProductCatalog products={products} initialCategory={filters.category} initialQuery={filters.q} /></div>
      </main>
    </div>
  );
}
