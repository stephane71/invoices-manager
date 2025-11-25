import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "new.error.name"),
  description: z.string(),
  price: z.number().int().nonnegative("new.error.price"),
});

export type ProductForm = z.infer<typeof productFormSchema>;
