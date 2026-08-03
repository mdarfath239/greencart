import type { Database } from "@/lib/database.types";
import { createSupabasePublicClient } from "@/lib/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export const fallbackProducts: Product[] = [
  { id: "apple", name: "Royal Gala Apples", description: "Crisp, sweet apples.", price: 180, offer_price: 149, category: "Fresh Fruits", image_urls: ["/images/apple_image.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
  { id: "banana", name: "Everyday Bananas", description: "Naturally sweet bunches.", price: 70, offer_price: 59, category: "Fresh Fruits", image_urls: ["/images/banana_image_1.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
  { id: "carrot", name: "Crunchy Carrots", description: "Freshly harvested carrots.", price: 65, offer_price: 55, category: "Vegetables", image_urls: ["/images/carrot_image.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
  { id: "tomato", name: "Vine Tomatoes", description: "Juicy red tomatoes.", price: 80, offer_price: 69, category: "Vegetables", image_urls: ["/images/tomato_image.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
  { id: "paneer", name: "Fresh Paneer", description: "Rich, soft cottage cheese.", price: 130, offer_price: 115, category: "Dairy", image_urls: ["/images/paneer_image.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
  { id: "rice", name: "Basmati Rice", description: "Long-grain aromatic rice.", price: 240, offer_price: 199, category: "Grains", image_urls: ["/images/basmati_rice_image.png"], in_stock: true, seller_id: "demo", created_at: "2026-01-01T00:00:00Z" },
];

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) throw error;
    return data.length ? data : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.length ? data : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const fallback = fallbackProducts.find((product) => product.id === id);

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ?? fallback ?? null;
  } catch {
    return fallback ?? null;
  }
}
