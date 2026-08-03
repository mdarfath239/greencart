"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import type { Database } from "@/lib/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductCatalog({ products, initialCategory = "All", initialQuery = "" }: { products: Product[]; initialCategory?: string; initialQuery?: string }) {
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const [activeCategory, setActiveCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All");
  const [query, setQuery] = useState(initialQuery);

  const matchingProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesQuery = !normalizedQuery || [product.name, product.category, product.description]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, products, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-[#dce5d6] py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category ? "bg-[#1f6b39] text-white" : "bg-white text-[#49604e] hover:bg-[#e8f0e4]"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the market"
            className="w-full rounded-full border border-[#cfddca] bg-white px-5 py-3 pr-10 text-sm outline-none transition placeholder:text-[#879588] focus:border-[#4d924f] focus:ring-4 focus:ring-[#cfe4c9]"
          />
          <span className="pointer-events-none absolute right-4 top-2.5 text-lg text-[#4d784f]" aria-hidden>⌕</span>
        </label>
      </div>

      <p className="py-6 text-sm text-[#67786a]">{matchingProducts.length} {matchingProducts.length === 1 ? "item" : "items"} found</p>
      {matchingProducts.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {matchingProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#b6cdb0] bg-[#f1f6ee] px-6 py-20 text-center">
          <p className="font-[family-name:var(--font-display)] text-3xl text-[#365b3b]">No good match yet.</p>
          <p className="mt-3 text-sm text-[#637867]">Try a different search or browse another aisle.</p>
        </div>
      )}
    </div>
  );
}
