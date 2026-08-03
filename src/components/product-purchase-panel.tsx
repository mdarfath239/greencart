"use client";

import { useState } from "react";

import type { Database } from "@/lib/database.types";
import { useCartStore } from "@/lib/cart-store";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const image = product.image_urls[0] || "/images/apple_image.png";

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <div className="flex h-12 items-center rounded-full border border-[#cfddca] bg-white p-1">
        <button aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-10 w-10 place-items-center rounded-full text-lg text-[#2f653b] hover:bg-[#edf5e9]">−</button>
        <output className="grid w-9 place-items-center text-sm font-bold">{quantity}</output>
        <button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="grid h-10 w-10 place-items-center rounded-full text-lg text-[#2f653b] hover:bg-[#edf5e9]">+</button>
      </div>
      <button disabled={!product.in_stock} onClick={() => addItem({ id: product.id, name: product.name, price: product.offer_price, image, inStock: product.in_stock }, quantity)} className="h-12 rounded-full bg-[#1f6b39] px-7 text-sm font-bold text-white transition hover:bg-[#15562d] disabled:cursor-not-allowed disabled:bg-[#9baba0]">
        {product.in_stock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
