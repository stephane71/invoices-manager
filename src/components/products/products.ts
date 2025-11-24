import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().int().nonnegative("Price must be positive"),
});

export type ProductForm = z.infer<typeof productFormSchema>;
