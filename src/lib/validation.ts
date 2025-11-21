import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// Base validators
export const phoneValidator = z
  .string()
  .refine((val) => isValidPhoneNumber(val), {
    message:
      "Invalid phone number format. Use international format (e.g., +33612345678)",
  });

export const emailValidator = z.email();

// Optional versions with empty string handling (for forms)
export const optionalPhone = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => (val === "" ? null : val))
  .refine((val) => !val || isValidPhoneNumber(val), {
    message:
      "Invalid phone number format. Use international format (e.g., +33612345678)",
  });

export const optionalEmail = z
  .email()
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => (val === "" ? null : val));

export const productSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().int().nonnegative(), // price in cents (integer)
  image_url: z.url().or(z.literal("")).optional().nullable(),
});

// Form-specific schema for React Hook Form (uses string types, no transforms)
export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().int().nonnegative("Price must be positive"),
});

export const clientSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: optionalPhone,
  email: optionalEmail,
});

// Form-specific schema for React Hook Form (uses string types, no transforms)
export const clientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email").or(z.literal("")),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), {
    message: "Invalid phone number format",
  }),
  address: z.string(),
});

export const invoiceItemSchema = z.object({
  product_id: z.uuid(),
  name: z.string().min(1),
  quantity: z.number().positive(), // can be fractional (e.g., 1.5 hours)
  price: z.number().int().nonnegative(), // unit price in cents (integer)
  total: z.number().int().nonnegative(), // line total in cents (integer)
});

export const invoiceSchema = z.object({
  id: z.uuid().optional(),
  client_id: z.uuid(),
  items: z.array(invoiceItemSchema),
  total_amount: z.number().int().nonnegative(), // total amount in cents (integer)
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  issue_date: z.string(),
  due_date: z.string().optional(),
  pdf_url: z.url().optional().nullable(),
  number: z.string(),
});

export const profileSchema = z.object({
  id: z.uuid().optional(),
  full_name: z.string().optional().nullable(),
  email: optionalEmail,
  phone: optionalPhone,
  address: z.string().optional().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
