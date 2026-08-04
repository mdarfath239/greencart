"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import type { Database } from "@/lib/database.types";
import { useCartStore } from "@/lib/cart-store";

type Product = Database["public"]["Tables"]["products"]["Row"];

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <svg key={index} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-3.5 md:w-3.5">
          <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#4FBF8B" />
        </svg>
      ))}
      <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
        <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#4FBF8B" fillOpacity="0.35" />
      </svg>
      <p className="text-xs text-gray-500/60">(4)</p>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.image_urls[0] || "/images/apple_image.png";
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="max-w-54 rounded-md border border-gray-500/20 px-3 py-2 md:px-4">
      <Link href={`/products/${product.id}`} className="group flex cursor-pointer items-center justify-center py-2">
        <Image
          src={image}
          alt={product.name}
          width={144}
          height={144}
          className="max-w-26 transition group-hover:scale-105 md:max-w-36"
        />
      </Link>
      <div className="text-sm text-gray-500/60">
        <p>{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <p className="truncate text-lg font-medium text-gray-700">{product.name}</p>
        </Link>
        <StarRating />
        <div className="mt-2 flex items-end justify-between">
          <p className="text-base font-medium text-primary md:text-xl">
            ₹{product.offer_price.toFixed(0)}{" "}
            {product.offer_price < product.price && (
              <span className="text-xs text-gray-500/60 line-through md:text-sm">₹{product.price.toFixed(0)}</span>
            )}
          </p>
          <button
            type="button"
            disabled={!product.in_stock}
            onClick={() => addItem({ id: product.id, name: product.name, price: product.offer_price, image, inStock: product.in_stock })}
            className="flex h-8.5 w-16 cursor-pointer items-center justify-center gap-1 rounded border border-primary/40 bg-primary/10 px-2 text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50 md:w-20"
          >
            <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
