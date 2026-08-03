import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().trim().min(2, "Enter the recipient's name.").max(100),
  phone: z.string().trim().min(5, "Enter a valid phone number.").max(30),
  street: z.string().trim().min(4, "Enter a complete street address.").max(240),
  city: z.string().trim().min(2, "Enter a city.").max(100),
  state: z.string().trim().min(2, "Enter a state or region.").max(100),
  zip: z.string().trim().min(3, "Enter a postal code.").max(20),
  country: z.string().trim().min(2, "Enter a country.").max(100),
});

export type AddressInput = z.infer<typeof addressSchema>;
