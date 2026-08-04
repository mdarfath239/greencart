import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";
import { readOrderLines } from "@/lib/order-types";
import { getAuthenticatedSeller } from "@/lib/seller-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createOrderSchema, updateOrderStatusSchema } from "@/lib/validations/order";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
    const { data, error } = await createSupabaseAdminClient().from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) {
      if (error.code === "PGRST205") {
        return NextResponse.json({ error: "Database setup required. Run npm run db:setup after adding DATABASE_URL." }, { status: 503 });
      }
      throw error;
    }
    return NextResponse.json({ orders: data });
  } catch (error) {
    console.error("Unable to load orders", error);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
    const parsed = createOrderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Your order details are invalid.", issues: parsed.error.flatten() }, { status: 422 });
    const order = await createOrder({ userId, addressId: parsed.data.address_id, requestedItems: parsed.data.items });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to place your order.";
    console.error("Unable to place order", error);
    const status = error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  const seller = await getAuthenticatedSeller();
  if (!seller) return NextResponse.json({ error: "Seller authorization is required." }, { status: 403 });
  try {
    const parsed = updateOrderStatusSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid order status." }, { status: 422 });
    const supabase = createSupabaseAdminClient();
    const { data: order, error: orderError } = await supabase.from("orders").select("items").eq("id", parsed.data.id).maybeSingle();
    if (orderError) throw orderError;
    if (!order || !readOrderLines(order.items).some((item) => item.seller_id === seller.userId)) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const { data, error } = await supabase.from("orders").update({ status: parsed.data.status }).eq("id", parsed.data.id).select("*").single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("Unable to update order", error);
    return NextResponse.json({ error: "Unable to update the order." }, { status: 500 });
  }
}
