import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { OrderLine } from "@/lib/order-types";

class OrderError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

export async function createOrder({ userId, addressId, requestedItems }: { userId: string; addressId: string; requestedItems: { product_id: string; qty: number }[] }) {
  const supabase = createSupabaseAdminClient();
  const { data: address, error: addressError } = await supabase.from("addresses").select("id").eq("id", addressId).eq("user_id", userId).maybeSingle();
  if (addressError) throw addressError;
  if (!address) throw new OrderError("Select one of your saved delivery addresses.", 422);

  const productIds = [...new Set(requestedItems.map((item) => item.product_id))];
  const { data: products, error: productsError } = await supabase.from("products").select("id, name, offer_price, in_stock, seller_id").in("id", productIds);
  if (productsError) throw productsError;
  if (products.length !== productIds.length) throw new OrderError("One or more items are no longer available.", 409);

  const byId = new Map(products.map((product) => [product.id, product]));
  const items: OrderLine[] = requestedItems.map(({ product_id, qty }) => {
    const product = byId.get(product_id);
    if (!product || !product.in_stock) throw new OrderError("One or more items are out of stock.", 409);
    return { product_id, name: product.name, price: product.offer_price, qty, seller_id: product.seller_id };
  });
  const amount = items.reduce((total, item) => total + item.price * item.qty, 0);

  const { data, error } = await supabase.from("orders").insert({ user_id: userId, address_id: addressId, items, amount, payment_type: "COD", is_paid: false }).select("*").single();
  if (error) throw error;
  return data;
}

export async function getCustomerOrders(userId: string) {
  const { data, error } = await createSupabaseAdminClient().from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
