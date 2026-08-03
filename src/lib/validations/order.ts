import { z } from "zod";

export const createOrderSchema = z.object({
  address_id: z.string().uuid(),
  items: z.array(z.object({ product_id: z.string().uuid(), qty: z.coerce.number().int().min(1).max(99) })).min(1).max(50),
});

export const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["Order Placed", "Packed", "Shipped", "Delivered", "Cancelled"]),
});
