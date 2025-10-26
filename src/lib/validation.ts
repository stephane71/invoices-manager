import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().int().nonnegative(), // price in cents (integer)
  image_url: z.string().url().or(z.literal("")).optional().nullable(),
});

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .string()
    .email()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
});

export const invoiceItemSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().positive(), // can be fractional (e.g., 1.5 hours)
  price: z.number().int().nonnegative(), // unit price in cents (integer)
  total: z.number().int().nonnegative(), // line total in cents (integer)
});

export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  items: z.array(invoiceItemSchema),
  total_amount: z.number().int().nonnegative(), // total amount in cents (integer)
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  issue_date: z.string(),
  due_date: z.string().optional(),
  pdf_url: z.string().url().optional().nullable(),
  number: z.string(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
