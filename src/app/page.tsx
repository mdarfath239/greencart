import { CategoryGrid } from "@/components/category-grid";
import { HeroBanner } from "@/components/hero-banner";
import { Newsletter } from "@/components/newsletter";
import { PageLayout } from "@/components/page-layout";
import { ProductCard } from "@/components/product-card";
import { WhyWeAreBest } from "@/components/why-we-are-best";
import { getFeaturedProducts } from "@/lib/products";

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <PageLayout>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <HeroBanner />
        <CategoryGrid />

        <section id="best-sellers" className="mt-16">
          <p className="text-2xl font-medium md:text-3xl">Best Sellers</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <WhyWeAreBest />
        <Newsletter />
      </div>
    </PageLayout>
  );
}
