import type { Json } from "@/lib/database.types";

export type OrderLine = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  seller_id: string;
};

export function isOrderLine(value: Json): value is OrderLine {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    && typeof value.product_id === "string" && typeof value.name === "string"
    && typeof value.price === "number" && typeof value.qty === "number" && typeof value.seller_id === "string";
}

export function readOrderLines(items: Json): OrderLine[] {
  return Array.isArray(items) ? items.filter(isOrderLine) : [];
}
