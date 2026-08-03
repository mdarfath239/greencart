import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { readOrderLines } from "@/lib/order-types";

export async function getSellerProducts(sellerId: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSellerOrders(sellerId: string) {
  const { data, error } = await createSupabaseAdminClient().from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.filter((order) => readOrderLines(order.items).some((item) => item.seller_id === sellerId));
}
