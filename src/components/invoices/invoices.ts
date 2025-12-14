import { z } from "zod";

export const invoiceItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0),
  total: z.number().min(0),
  quantityInput: z.string().optional(),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export const INVOICE_ITEM_EMPTY: InvoiceItem = {
  product_id: "",
  name: "",
  quantity: 1,
  price: 0,
  total: 0,
  quantityInput: "1",
};

export const invoiceFormSchema = z.object({
  number: z.string().min(1, "new.error.numberRequired"),
  clientId: z.string().min(1, "new.error.clientRequired"),
  issueDate: z.string().min(1),
  items: z
    .array(invoiceItemSchema)
    .min(1, "new.error.itemsRequired")
    .refine(
      (items) =>
        items.every(
          (item) => item.product_id && item.name && item.quantity > 0,
        ),
      { message: "new.error.itemsIncomplete" },
    ),
  operationType: z.enum(["services", "goods", "mixed"], {
    message: "new.error.operationTypeRequired",
  }),
  vatExemptionMention: z.string().optional().or(z.literal("")),
  paymentIban: z.string().optional().or(z.literal("")),
  paymentBic: z.string().optional().or(z.literal("")),
  paymentLink: z.string().optional().or(z.literal("")),
  paymentFreeText: z.string().optional().or(z.literal("")),
});

export type InvoiceForm = z.infer<typeof invoiceFormSchema>;
