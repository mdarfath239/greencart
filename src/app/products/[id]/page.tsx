import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getProductById } from "@/lib/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const image = product.image_urls[0] || "/images/apple_image.png";

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-14">
        <Link href="/products" className="inline-flex text-sm font-bold text-[#29763d] hover:text-[#15562d]">← Back to the market</Link>
        <div className="mt-7 grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#eef5e9]">
            <Image src={image} alt={product.name} fill priority className="object-contain p-10" sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
          <section>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">{product.category}</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{product.name}</h1>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#1f6b39]">₹{product.offer_price.toFixed(0)}</span>
              {product.offer_price < product.price && <span className="text-lg text-[#829084] line-through">₹{product.price.toFixed(0)}</span>}
            </div>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#5d715f]">{product.description}</p>
            <p className={`mt-7 text-sm font-bold ${product.in_stock ? "text-[#26713a]" : "text-[#9a493a]"}`}>{product.in_stock ? "● In stock and ready to go" : "● Currently out of stock"}</p>
            <ProductPurchasePanel product={product} />
            <div className="mt-10 grid grid-cols-2 gap-3 border-t border-[#dce5d6] pt-6 text-sm text-[#58705b]">
              <p><strong className="block text-[#294631]">Freshness first</strong>Carefully selected for you.</p>
              <p><strong className="block text-[#294631]">Easy delivery</strong>Cash on delivery available.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
