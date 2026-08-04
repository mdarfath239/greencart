import { PageLayout } from "@/components/page-layout";
import { ProductCard } from "@/components/product-card";
import { getAllProducts } from "@/lib/products";

export const metadata = { title: "Offers & Deals | GreenCart" };

export default async function DealsPage() {
  const products = await getAllProducts();
  const deals = products.filter((product) => product.offer_price < product.price);

  return (
    <PageLayout>
      <main className="px-6 py-10 md:px-16 lg:px-24 xl:px-32">
        <p className="text-2xl font-medium md:text-3xl">Offers &amp; Deals</p>
        <p className="mt-2 text-sm text-gray-500">Save on fresh groceries with limited-time offers.</p>

        {deals.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
            <p className="text-2xl font-medium text-gray-900">No active deals right now.</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for fresh savings.</p>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
