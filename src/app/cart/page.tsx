import { CartPageClient } from "@/components/cart-page-client";
import { PageLayout } from "@/components/page-layout";

export const metadata = { title: "Your cart | GreenCart" };

export default function CartPage() {
  return (
    <PageLayout>
      <main className="px-6 py-10 md:px-16 lg:px-24 xl:px-32">
        <p className="text-2xl font-medium md:text-3xl">Your cart</p>
        <div className="mt-8">
          <CartPageClient />
        </div>
      </main>
    </PageLayout>
  );
}
