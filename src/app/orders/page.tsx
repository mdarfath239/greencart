import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PageLayout } from "@/components/page-layout";
import { getCustomerOrders, OrdersUnavailableError } from "@/lib/orders";
import { readOrderLines } from "@/lib/order-types";

export const metadata = { title: "My orders | GreenCart" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const query = await searchParams;
  let orders: Awaited<ReturnType<typeof getCustomerOrders>> = [];
  let setupRequired = false;

  try {
    orders = await getCustomerOrders(userId);
  } catch (error) {
    if (error instanceof OrdersUnavailableError) setupRequired = true;
    else throw error;
  }

  return (
    <PageLayout>
      <main className="px-6 py-10 md:px-16 lg:px-24 xl:px-32">
        <p className="text-2xl font-medium md:text-3xl">My orders</p>

        {query.placed && !setupRequired && (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-5 py-4 text-sm text-gray-700">
            <strong>Order placed!</strong> We&apos;ll collect your cash on delivery and keep you posted as it moves.
          </div>
        )}

        {setupRequired ? (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-gray-900">Database setup required</p>
            <p className="mt-2 text-sm text-gray-600">
              Run the Supabase migration, then restart the app. From the project root:
            </p>
            <code className="mt-4 block rounded bg-white px-4 py-3 text-left text-xs text-gray-700">
              npm run db:setup
            </code>
            <p className="mt-3 text-xs text-gray-500">
              Add <strong>DATABASE_URL</strong> to <strong>.env.local</strong> (Supabase → Project Settings → Database → Connection string).
            </p>
          </div>
        ) : orders.length ? (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-gray-300/60 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Order #{order.id.slice(0, 8)}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })} · Cash on Delivery
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{order.status}</span>
                </div>
                <div className="mt-5 border-t border-gray-200 pt-4 text-sm">
                  {readOrderLines(order.items).map((line) => (
                    <div key={line.product_id} className="flex justify-between py-1">
                      <span>
                        {line.name} <span className="text-gray-500">× {line.qty}</span>
                      </span>
                      <strong>₹{(line.price * line.qty).toFixed(0)}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm font-semibold">Total</span>
                  <strong className="text-xl text-primary">₹{order.amount.toFixed(0)}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
            <p className="text-2xl font-medium text-gray-900">No orders yet.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-dull">
              Browse groceries
            </Link>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
