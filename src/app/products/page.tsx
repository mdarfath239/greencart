import { PageLayout } from "@/components/page-layout";
import { ProductCatalog } from "@/components/product-catalog";
import { getAllProducts } from "@/lib/products";

export const metadata = { title: "All products | GreenCart" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const products = await getAllProducts();
  const filters = await searchParams;

  return (
    <PageLayout>
      <main className="px-6 py-10 md:px-16 lg:px-24 xl:px-32">
        <p className="text-2xl font-medium md:text-3xl">All products</p>
        <div className="mt-8">
          <ProductCatalog products={products} initialCategory={filters.category} initialQuery={filters.q} />
        </div>
      </main>
    </PageLayout>
  );
}
