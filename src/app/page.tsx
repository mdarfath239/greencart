import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/products";

const categories = [
  { name: "Fresh Fruits", image: "/images/fresh_fruits_image.png" },
  { name: "Vegetables", image: "/images/organic_vegitable_image.png" },
  { name: "Dairy", image: "/images/dairy_product_image.png" },
  { name: "Grains", image: "/images/grain_image.png" },
  { name: "Bakery", image: "/images/bakery_image.png" },
];

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfaf5] text-[#1c2b20]">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-6 lg:px-8">
          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-[#dcead1] px-7 py-12 sm:px-12 lg:min-h-[480px] lg:px-16">
            <Image
              src="/images/main_banner_bg.png"
              alt="Fresh produce arranged in a market crate"
              fill
              priority
              className="object-cover object-center mix-blend-multiply opacity-55"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#e5f2dd] via-[#e5f2dd]/90 to-[#e5f2dd]/20" />
            <div className="relative max-w-xl">
              <p className="mb-5 inline-flex rounded-full border border-[#34733f]/20 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#34733f]">
                Groceries, minus the errand
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[0.93] tracking-[-0.05em] text-[#193c25] sm:text-6xl lg:text-7xl">
                Farm-fresh finds,
                <span className="block text-[#4f913b]">at your door.</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-7 text-[#426048] sm:text-lg">
                Handpicked produce, pantry staples, and little everyday delights—delivered with care.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1f6b39] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#15562d]"
              >
                Shop today <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Shop by aisle</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] sm:text-4xl">Pick a category</h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#28743c] hover:text-[#15562d]">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-[#dce5d6] bg-white p-3 transition hover:-translate-y-1 hover:border-[#84b56e] hover:shadow-[0_16px_35px_-22px_rgba(34,92,48,0.65)]"
              >
                <div className="relative aspect-[1.12] overflow-hidden rounded-xl bg-[#f0f5eb]">
                  <Image src={category.image} alt="" fill className="object-contain p-3 transition duration-300 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 20vw" />
                </div>
                <p className="px-1 pb-1 pt-3 text-sm font-bold">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">This week&apos;s market</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-[-0.03em] sm:text-4xl">Fresh picks for you</h2>
            </div>
            <Link href="/products" className="text-sm font-bold text-[#28743c] hover:text-[#15562d]">Browse products →</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
    </div>
  );
}
