import Image from "next/image";
import Link from "next/link";

import { categories } from "@/lib/site-data";

export function CategoryGrid() {
  return (
    <section className="mt-16">
      <p className="text-2xl font-medium md:text-3xl">Categories</p>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/products?category=${encodeURIComponent(category.filter)}`}
            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg px-3 py-5 transition hover:-translate-y-1"
            style={{ backgroundColor: category.bg }}
          >
            <Image
              src={category.image}
              alt={category.name}
              width={112}
              height={112}
              className="max-w-28 transition group-hover:scale-108"
            />
            <p className="text-center text-sm font-medium">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
