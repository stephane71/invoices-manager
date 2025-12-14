import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

export const profileSchema = z.object({
  fullName: z.string().min(1, "Validation.name.required"),
  email: z.email("Validation.email.invalid"),
  phone: z
    .string()
    .refine(
      (val) => isValidPhoneNumber(val, { isOptional: true }),
      "Validation.phone.invalid",
    ),
  siret: z
    .string()
    .min(1, "Validation.siret.required")
    .refine(
      (val) => /^\d{14}$/.test(val.replace(/\s/g, "")),
      "Validation.siret.invalid",
    ),
  addressStreet: z.string().min(1, "Validation.addressStreet.required"),
  addressPostalCode: z.string().min(1, "Validation.addressPostalCode.required"),
  addressCity: z.string().min(1, "Validation.addressCity.required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
