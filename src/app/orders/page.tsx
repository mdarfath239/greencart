import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { getCustomerOrders } from "@/lib/orders";
import { readOrderLines } from "@/lib/order-types";

export const metadata = { title: "My orders | GreenCart" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const [orders, query] = await Promise.all([getCustomerOrders(userId), searchParams]);
  return <div className="min-h-screen bg-[#fbfaf5] text-[#1c2b20]"><Navbar /><main className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f9365]">Your deliveries</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl tracking-[-0.05em]">My orders</h1>{query.placed && <div className="mt-7 rounded-2xl border border-[#a9c99d] bg-[#eef7e9] px-5 py-4 text-sm text-[#285f37]"><strong>Order placed!</strong> We&apos;ll collect your cash on delivery and keep you posted as it moves.</div>}<div className="mt-9 space-y-5">{orders.length ? orders.map((order) => <article key={order.id} className="rounded-[2rem] border border-[#dce5d6] bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f9365]">Order #{order.id.slice(0, 8)}</p><p className="mt-2 text-sm text-[#68796a]">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })} · Cash on Delivery</p></div><span className="rounded-full bg-[#e2f0dc] px-3 py-2 text-xs font-bold text-[#28683a]">{order.status}</span></div><div className="mt-5 border-t border-[#e5ece1] pt-4 text-sm">{readOrderLines(order.items).map((line) => <div key={line.product_id} className="flex justify-between py-1"><span>{line.name} <span className="text-[#758576]">× {line.qty}</span></span><strong>₹{(line.price * line.qty).toFixed(0)}</strong></div>)}</div><div className="mt-4 flex justify-between border-t border-[#e5ece1] pt-4"><span className="text-sm font-bold">Total</span><strong className="font-[family-name:var(--font-display)] text-xl">₹{order.amount.toFixed(0)}</strong></div></article>) : <div className="rounded-[2rem] border border-dashed border-[#b7ceb1] bg-[#f1f6ee] px-6 py-20 text-center"><p className="font-[family-name:var(--font-display)] text-3xl">No orders yet.</p><Link href="/products" className="mt-6 inline-flex rounded-full bg-[#1f6b39] px-5 py-3 text-sm font-bold text-white">Browse groceries</Link></div>}</div></main></div>;
}
