import { z } from "zod";
import {
  clientSchema,
  invoiceItemSchema,
  invoiceSchema,
  productSchema,
  profileSchema,
} from "@/lib/validation";

export type Product = z.infer<typeof productSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type Profile = z.infer<typeof profileSchema>;
