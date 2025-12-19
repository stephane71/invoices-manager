import { z } from "zod";
import {
  clientCompanySchema,
  clientPersonSchema,
  clientSchema,
  invoiceItemSchema,
  invoiceSchema,
  productSchema,
  profileSchema,
} from "@/lib/validation";

export type Product = z.infer<typeof productSchema>;

// Client types using discriminated union
export type ClientPerson = z.infer<typeof clientPersonSchema>;
export type ClientCompany = z.infer<typeof clientCompanySchema>;
export type Client = z.infer<typeof clientSchema>;

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type Profile = z.infer<typeof profileSchema>;
