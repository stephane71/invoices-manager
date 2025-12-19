import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

// Base form fields shared between person and company
const baseFormFields = {
  email: z.email("new.error.email").or(z.literal("")),
  phone: z
    .string()
    .refine((val) => isValidPhoneNumber(val, { isOptional: true }), {
      message: "new.error.phone",
    }),
  address: z.string(),
};

// Client Person Form Schema
export const clientPersonFormSchema = z.object({
  ...baseFormFields,
  client_type: z.literal("person"),
  firstname: z.string().min(1, "new.error.firstname"),
  lastname: z.string().min(1, "new.error.lastname"),
  // Company-only fields must be null/undefined/empty for persons
  name: z.literal("").or(z.undefined()).optional(),
  siren: z.literal("").or(z.undefined()).optional(),
  tva_number: z.literal("").or(z.undefined()).optional(),
});

// Client Company Form Schema
export const clientCompanyFormSchema = z.object({
  ...baseFormFields,
  client_type: z.literal("company"),
  name: z.string().min(1, "new.error.companyName"),
  siren: z
    .string()
    .min(1, "new.error.sirenRequired")
    .refine((val) => /^\d{9}$/.test(val.replace(/\s/g, "")), {
      message: "new.error.siren",
    }),
  tva_number: z.string().optional().or(z.literal("")),
  // Person-only fields must be null/undefined/empty for companies
  firstname: z.literal("").or(z.undefined()).optional(),
  lastname: z.literal("").or(z.undefined()).optional(),
});

// Client form schema using discriminated union for person vs company
export const clientFormSchema = z.discriminatedUnion("client_type", [
  clientPersonFormSchema,
  clientCompanyFormSchema,
]);

// Form types
export type ClientPersonForm = z.infer<typeof clientPersonFormSchema>;
export type ClientCompanyForm = z.infer<typeof clientCompanyFormSchema>;
export type ClientForm = z.infer<typeof clientFormSchema>;

// Enums
export const CLIENT_FORM_PERSON_DEFAULT: ClientForm = {
  client_type: "person",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  address: "",
};
