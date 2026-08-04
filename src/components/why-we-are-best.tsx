import Image from "next/image";

import { features } from "@/lib/site-data";

export function WhyWeAreBest() {
  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="/images/banner_image.png"
          alt="Fresh groceries banner"
          width={1400}
          height={420}
          className="hidden h-auto w-full md:block"
        />
        <Image
          src="/images/banner_image_sm.png"
          alt="Fresh groceries banner"
          width={800}
          height={360}
          className="h-auto w-full md:hidden"
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Why We Are the Best?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-lg bg-white/90 p-4 backdrop-blur-sm">
                  <Image src={feature.icon} alt="" width={40} height={40} className="h-10 w-10" />
                  <h3 className="mt-3 text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
