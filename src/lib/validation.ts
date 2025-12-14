import { z } from "zod";
import { isValidPhoneNumber } from "@/lib/utils";

export const optionalPhone = z
  .string()
  .optional()
  .nullable()
  .or(z.literal(""))
  .transform((val) => (val === "" ? null : val))
  .refine((val) => isValidPhoneNumber(val, { isOptional: true }), {
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
  id: z.uuid(),
  account_id: z.uuid(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().int().nonnegative(), // price in cents (integer)
  image_url: z.url().or(z.literal("")).optional().nullable(),
});

export const clientSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: optionalPhone,
  email: optionalEmail,
  // SIREN validation (9 digits, spaces optional)
  siren: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^\d{9}$/.test(val.replace(/\s/g, "")),
      { message: "SIREN must be 9 digits" }
    ),
});

export const invoiceItemSchema = z.object({
  id: z.uuid(),
  invoice_id: z.uuid(),
  product_id: z.uuid(),
  name: z.string().min(1),
  quantity: z.number().positive(), // can be fractional (e.g., 1.5 hours)
  price: z.number().int().nonnegative(), // unit price in cents (integer)
  total: z.number().int().nonnegative(), // line total in cents (integer)
});

export const invoiceSchema = z.object({
  id: z.uuid(),
  account_id: z.uuid(),
  client_id: z.uuid(),
  items: z.array(invoiceItemSchema),
  total_amount: z.number().int().nonnegative(), // total amount in cents (integer)
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  issue_date: z.string(),
  due_date: z.string().optional(),
  pdf_url: z.url().optional().nullable(),
  number: z.string(),
  // Payment information
  payment_iban: z.string().optional().nullable(),
  payment_bic: z.string().optional().nullable(),
  payment_link: z.string().optional().nullable(),
  payment_free_text: z.string().optional().nullable(),
  // Operation type and VAT exemption
  operation_type: z.enum(["services", "goods", "mixed"]),
  vat_exemption_mention: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  id: z.uuid(),
  full_name: z.string().optional().nullable(),
  email: optionalEmail,
  phone: optionalPhone,
  // Structured address fields
  address_street: z.string().optional().nullable(),
  address_postal_code: z.string().optional().nullable(),
  address_city: z.string().optional().nullable(),
  // Deprecated: kept for backward compatibility during transition
  address: z.string().optional().nullable(),
  payment_iban: z.string().optional().nullable(),
  payment_bic: z.string().optional().nullable(),
  // SIRET validation (14 digits, spaces optional)
  siret: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^\d{14}$/.test(val.replace(/\s/g, "")),
      { message: "SIRET must be 14 digits" }
    ),
});

// Profile completeness validation for PDF generation
export type ProfileValidationResult = {
  isComplete: boolean;
  missingFields: string[];
  warnings: string[];
};

/**
 * Validates if a profile has all required fields for PDF generation.
 * Based on French legal requirements for invoices.
 *
 * Critical fields (PDF generation blocked without these):
 * - full_name: Business/seller name (minimum 2 characters)
 * - siret: French business identifier (14 digits)
 * - address: Complete business address (in format "Street, Postal Code City")
 *   OR structured address fields (address_street, address_postal_code, address_city)
 *
 * Recommended fields (warnings if missing):
 * - email: Business contact email
 * - phone: Business contact phone
 *
 * @param profile - The profile to validate
 * @returns ProfileValidationResult with completion status and missing/warning fields
 */
export const validateProfileForPdfGeneration = (
  profile: z.infer<typeof profileSchema>
): ProfileValidationResult => {
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Critical field: full_name
  if (!profile.full_name || profile.full_name.trim().length < 2) {
    missingFields.push("full_name");
  }

  // Critical field: SIRET
  if (!profile.siret || profile.siret.replace(/\s/g, "").length !== 14) {
    missingFields.push("siret");
  }

  // Critical field: address (support both legacy and structured formats)
  const hasLegacyAddress = profile.address && profile.address.includes(",");
  const hasStructuredAddress =
    profile.address_street &&
    profile.address_postal_code &&
    profile.address_city;

  if (!hasLegacyAddress && !hasStructuredAddress) {
    missingFields.push("address");
  }

  // Recommended field: email
  if (!profile.email) {
    warnings.push("email");
  }

  // Recommended field: phone
  if (!profile.phone) {
    warnings.push("phone");
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    warnings,
  };
};
