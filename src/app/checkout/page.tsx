import { CheckoutClient } from "@/components/checkout-client";
import { PageLayout } from "@/components/page-layout";

export const metadata = { title: "Checkout | GreenCart" };

export default function CheckoutPage() {
  return (
    <PageLayout>
      <main className="px-6 py-10 md:px-16 lg:px-24 xl:px-32">
        <p className="text-2xl font-medium md:text-3xl">Checkout</p>
        <div className="mt-8">
          <CheckoutClient />
        </div>
      </main>
    </PageLayout>
  );
}
