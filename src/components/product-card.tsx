"use client";

import Image from "next/image";
import Link from "next/link";

import type { Database } from "@/lib/database.types";
import { useCartStore } from "@/lib/cart-store";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductCard({ product }: { product: Product }) {
  const image = product.image_urls[0] || "/images/apple_image.png";
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f0f5eb]">
          <Image src={image} alt={product.name} fill className="object-contain p-5 transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          {!product.in_stock && <span className="absolute left-3 top-3 rounded-full bg-[#263a2d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Sold out</span>}
        </div>
        <div className="px-1 pt-3">
          <p className="truncate text-sm font-bold text-[#23372a]">{product.name}</p>
          <p className="mt-1 text-xs text-[#6d7d70]">{product.category}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1f6b39]">₹{product.offer_price.toFixed(0)}</span>
            {product.offer_price < product.price && <span className="text-xs text-[#829084] line-through">₹{product.price.toFixed(0)}</span>}
          </div>
        </div>
      </Link>
      <button
        disabled={!product.in_stock}
        onClick={() => addItem({ id: product.id, name: product.name, price: product.offer_price, image, inStock: product.in_stock })}
        className="mt-3 w-full rounded-full border border-[#99ba8d] bg-white py-2 text-xs font-bold text-[#276d39] transition hover:border-[#276d39] hover:bg-[#edf5e9] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.in_stock ? "Add to cart" : "Out of stock"}
      </button>
    </article>
  );
}
