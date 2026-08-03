export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "Order Placed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentType = "COD" | "Online";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { clerk_id: string; role: "customer" | "seller"; created_at: string };
        Insert: { clerk_id: string; role?: "customer" | "seller"; created_at?: string };
        Update: { clerk_id?: string; role?: "customer" | "seller"; created_at?: string };
        Relationships: [];
      };
      products: {
        Row: { id: string; name: string; description: string; price: number; offer_price: number; category: string; image_urls: string[]; in_stock: boolean; seller_id: string; created_at: string };
        Insert: { id?: string; name: string; description?: string; price: number; offer_price: number; category: string; image_urls?: string[]; in_stock?: boolean; seller_id: string; created_at?: string };
        Update: { name?: string; description?: string; price?: number; offer_price?: number; category?: string; image_urls?: string[]; in_stock?: boolean };
        Relationships: [];
      };
      addresses: {
        Row: { id: string; user_id: string; name: string; phone: string; street: string; city: string; state: string; zip: string; country: string; created_at: string };
        Insert: { id?: string; user_id: string; name: string; phone: string; street: string; city: string; state: string; zip: string; country: string; created_at?: string };
        Update: { name?: string; phone?: string; street?: string; city?: string; state?: string; zip?: string; country?: string };
        Relationships: [];
      };
      orders: {
        Row: { id: string; user_id: string; items: Json; amount: number; address_id: string; status: OrderStatus; payment_type: PaymentType; is_paid: boolean; created_at: string };
        Insert: { id?: string; user_id: string; items: Json; amount: number; address_id: string; status?: OrderStatus; payment_type?: PaymentType; is_paid?: boolean; created_at?: string };
        Update: { status?: OrderStatus; is_paid?: boolean; payment_type?: PaymentType };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
