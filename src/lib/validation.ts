import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
});

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
});

export const invoiceItemSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  items: z.array(invoiceItemSchema),
  total_amount: z.number().nonnegative(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  issue_date: z.string(),
  due_date: z.string(),
  pdf_url: z.string().url().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
