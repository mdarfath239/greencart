import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative mt-10">
      <Image
        src="/images/main_banner_bg.png"
        alt="Fresh groceries banner"
        width={1400}
        height={480}
        priority
        className="hidden h-auto w-full md:block"
      />
      <Image
        src="/images/main_banner_bg_sm.png"
        alt="Fresh groceries banner"
        width={800}
        height={420}
        priority
        className="h-auto w-full md:hidden"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-24 md:items-start md:justify-center md:pb-0 md:pl-18 lg:pl-24">
        <h1 className="max-w-72 text-center text-3xl font-bold leading-tight text-gray-900 md:max-w-80 md:text-left md:text-4xl lg:max-w-[26rem] lg:text-5xl lg:leading-[3.75rem]">
          Freshness You Can Trust, Savings You will Love!
        </h1>
        <div className="mt-6 flex items-center font-medium">
          <Link
            href="/products"
            className="group flex items-center gap-2 rounded bg-primary px-7 py-3 text-white transition hover:bg-primary-dull md:px-9"
          >
            Shop now
            <ArrowRight className="h-4 w-4 md:hidden" strokeWidth={2.5} />
          </Link>
          <Link
            href="/deals"
            className="group hidden items-center gap-2 px-9 py-3 md:flex"
          >
            Explore deals
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
