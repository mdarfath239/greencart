import { NextResponse } from "next/server";

import { getAuthenticatedSeller } from "@/lib/seller-auth";
import { deleteCloudinaryImages, uploadProductImage } from "@/lib/cloudinary";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { createSupabasePublicClient } from "@/lib/supabase";
import { productSchema, productUpdateSchema } from "@/lib/validations/product";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function GET() {
  try {
    const { data, error } = await createSupabasePublicClient().from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ products: data });
  } catch (error) {
    console.error("Unable to load products", error);
    return NextResponse.json({ error: "Unable to load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const seller = await getAuthenticatedSeller();
  if (!seller) return NextResponse.json({ error: "Seller authorization is required." }, { status: 403 });

  const uploadedPublicIds: string[] = [];
  try {
    const formData = await request.formData();
    const parsed = productSchema.safeParse({
      name: formData.get("name"), description: formData.get("description"), price: formData.get("price"),
      offer_price: formData.get("offer_price"), category: formData.get("category"),
    });
    if (!parsed.success) return NextResponse.json({ error: "Please correct the product fields.", issues: parsed.error.flatten() }, { status: 422 });

    const images = formData.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (!images.length) return NextResponse.json({ error: "Upload at least one product image." }, { status: 422 });
    if (images.length > 5) return NextResponse.json({ error: "You can upload up to 5 images." }, { status: 422 });
    if (images.some((image) => image.size > MAX_IMAGE_BYTES || !ALLOWED_IMAGE_TYPES.has(image.type))) {
      return NextResponse.json({ error: "Images must be JPG, PNG, or WebP and no larger than 5 MB." }, { status: 422 });
    }

    const imageUrls = await Promise.all(images.map(async (image) => {
      const uploaded = await uploadProductImage(image, seller.userId);
      uploadedPublicIds.push(uploaded.public_id);
      return uploaded.secure_url;
    }));

    const { data, error } = await createSupabaseAdminClient().from("products").insert({ ...parsed.data, image_urls: imageUrls, seller_id: seller.userId }).select("*").single();
    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    await deleteCloudinaryImages(uploadedPublicIds).catch((cleanupError) => console.error("Unable to clean up Cloudinary images", cleanupError));
    console.error("Unable to create product", error);
    return NextResponse.json({ error: "Unable to create the product." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const seller = await getAuthenticatedSeller();
  if (!seller) return NextResponse.json({ error: "Seller authorization is required." }, { status: 403 });

  try {
    const update = productUpdateSchema.safeParse(await request.json());
    if (!update.success) return NextResponse.json({ error: "Invalid product update." }, { status: 422 });
    const { id, ...productFields } = update.data;
    if (!Object.keys(productFields).length) return NextResponse.json({ error: "Provide at least one product field to update." }, { status: 422 });

    const { data, error } = await createSupabaseAdminClient().from("products").update(productFields).eq("id", id).eq("seller_id", seller.userId).select("*").maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("Unable to update product", error);
    return NextResponse.json({ error: "Unable to update the product." }, { status: 500 });
  }
}
