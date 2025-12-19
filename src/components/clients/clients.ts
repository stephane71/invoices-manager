import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

// Base form fields shared between person and company
const baseFormFields = {
  id: z.uuid().optional(), // Optional because it's generated on the backend
  email: z.email("new.error.email").or(z.literal("")),
  phone: z
    .string()
    .refine((val) => isValidPhoneNumber(val, { isOptional: true }), {
      message: "new.error.phone",
    }),
  address: z.string(),
};

// Client Person Form Schema
export const clientPersonFormSchema = z
  .object({
    ...baseFormFields,
    client_type: z.literal("person"),
    firstname: z.string().min(1, "new.error.firstname"),
    lastname: z.string().min(1, "new.error.lastname"),
  })
  .strict();

// Client Company Form Schema
export const clientCompanyFormSchema = z
  .object({
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
  })
  .strict();

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

export const CLIENT_FORM_COMPANY_DEFAULT: ClientForm = {
  client_type: "company",
  name: "",
  siren: "",
  tva_number: "",
  email: "",
  phone: "",
  address: "",
};
