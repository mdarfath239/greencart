import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters.").max(180),
  description: z.string().trim().min(8, "Add a short product description.").max(2_000),
  price: z.coerce.number().finite().nonnegative("Price must be positive."),
  offer_price: z.coerce.number().finite().nonnegative("Offer price must be positive."),
  category: z.string().trim().min(2, "Choose a category.").max(80),
}).refine((data) => data.offer_price <= data.price, { message: "Offer price cannot exceed price.", path: ["offer_price"] });

export const productUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(180).optional(),
  description: z.string().trim().min(8).max(2_000).optional(),
  price: z.coerce.number().finite().nonnegative().optional(),
  offer_price: z.coerce.number().finite().nonnegative().optional(),
  category: z.string().trim().min(2).max(80).optional(),
  in_stock: z.boolean().optional(),
}).superRefine((data, context) => {
  if (data.price !== undefined && data.offer_price !== undefined && data.offer_price > data.price) {
    context.addIssue({ code: "custom", message: "Offer price cannot exceed price.", path: ["offer_price"] });
  }
});
