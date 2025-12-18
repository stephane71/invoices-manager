import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

// Client form schema using discriminated union for person vs company
export const clientFormSchema = z.discriminatedUnion("client_type", [
  // Person form schema
  z.object({
    client_type: z.literal("person"),
    name: z.string().min(1, "new.error.name"),
    firstname: z.string().min(1, "new.error.firstname"),
    email: z.email("new.error.email").or(z.literal("")),
    phone: z
      .string()
      .refine((val) => isValidPhoneNumber(val, { isOptional: true }), {
        message: "new.error.phone",
      }),
    address: z.string(),
  }),
  // Company form schema
  z.object({
    client_type: z.literal("company"),
    name: z.string().min(1, "new.error.companyName"),
    siren: z
      .string()
      .min(1, "new.error.sirenRequired")
      .refine((val) => /^\d{9}$/.test(val.replace(/\s/g, "")), {
        message: "new.error.siren",
      }),
    tva_number: z.string().optional().or(z.literal("")),
    email: z.email("new.error.email").or(z.literal("")),
    phone: z
      .string()
      .refine((val) => isValidPhoneNumber(val, { isOptional: true }), {
        message: "new.error.phone",
      }),
    address: z.string(),
  }),
]);

export type ClientForm = z.infer<typeof clientFormSchema>;
