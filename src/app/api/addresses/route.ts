import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { addressSchema } from "@/lib/validations/address";

function unauthorized() {
  return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorized();

    const { data, error } = await createSupabaseAdminClient()
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ addresses: data });
  } catch (error) {
    console.error("Unable to load addresses", error);
    return NextResponse.json({ error: "Unable to load addresses." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorized();

    const parsed = addressSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please correct the address fields.", issues: parsed.error.flatten() }, { status: 422 });
    }

    const { data, error } = await createSupabaseAdminClient()
      .from("addresses")
      .insert({ ...parsed.data, user_id: userId })
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ address: data }, { status: 201 });
  } catch (error) {
    console.error("Unable to create address", error);
    return NextResponse.json({ error: "Unable to save the address." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return unauthorized();

    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "An address ID is required." }, { status: 400 });

    const { error } = await createSupabaseAdminClient()
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unable to delete address", error);
    return NextResponse.json({ error: "Unable to delete the address." }, { status: 500 });
  }
}
