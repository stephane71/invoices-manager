import { type ClassValue, clsx } from "clsx";
import { isValidPhoneNumber as isValidPhoneNumberFormLib } from "libphonenumber-js";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { APP_LOCALE, PRICE_PRECISION } from "@/lib/constants";

/**
 * Extract field errors from a Zod SafeParseError result
 * @param error - The Zod error object from safeParse
 * @returns An object mapping field names to error messages
 */
export function getZodFieldErrors<T>(error: z.ZodError): T {
  const flattened = z.flattenError(error);
  const errors = {} as T;
  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    const msgArray = messages as string[];
    if (msgArray && msgArray.length > 0) {
      errors[field as keyof T] = msgArray[0] as T[keyof T];
    }
  }
  return errors;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert cents (integer) to currency units (float)
 * @param cents - Price in cents (e.g., 12345 for €123.45)
 * @returns Price in currency units (e.g., 123.45)
 */
export function centsToCurrency(cents: number): number {
  return cents / 100;
}

/**
 * Convert currency units (float) to cents (integer)
 * @param currency - Price in currency units (e.g., 123.45)
 * @returns Price in cents (e.g., 12345)
 */
export function currencyToCents(currency: number): number {
  return Math.round(currency * 100);
}

/**
 * Parse a price input string and convert to cents
 * Handles various input formats: "12,34", "12.34", "1 234,56"
 * @param input - User input string
 * @returns Price in cents, or 0 if invalid
 */
export function parsePrice(input: string): number {
  if (!input || input.trim() === "") {
    return 0;
  }

  // Remove spaces (thousand separators)
  let cleaned = input.replace(/\s/g, "");

  // Replace comma with dot for parsing
  cleaned = cleaned.replace(",", ".");

  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return currencyToCents(parsed);
}

/**
 * Format cents as currency string
 * @param cents - Price in cents
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: fr-FR)
 * @returns Formatted currency string
 */
export function centsToCurrencyString(
  cents: number,
  currency: string = "EUR",
  locale: string = APP_LOCALE,
): string {
  const amount = centsToCurrency(cents);
  return numberToCurrency(amount, { currency, locale });
}

export function numberToCurrency(
  num: number,
  {
    precision = PRICE_PRECISION,
    currency = "EUR",
    locale = APP_LOCALE,
  }: {
    precision?: number;
    currency: string;
    locale?: string;
  },
) {
  return num.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export const isValidPhoneNumber = (
  phoneNumber: string | null | undefined,
  { isOptional = true }: { isOptional?: boolean } = {},
) => {
  if (isOptional && !phoneNumber) {
    return true;
  }

  return isValidPhoneNumberFormLib(phoneNumber || "");
};

/**
 * Formats SIRET for display with spaces
 * @param siret - Raw SIRET (14 digits)
 * @returns Formatted SIRET (XXX XXX XXX XXXXX)
 */
export const formatSiret = (siret: string): string => {
  const cleaned = siret.replace(/\s/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, "$1 $2 $3 $4");
};

/**
 * Formats SIREN for display with spaces
 * @param siren - Raw SIREN (9 digits)
 * @returns Formatted SIREN (XXX XXX XXX)
 */
export const formatSiren = (siren: string): string => {
  const cleaned = siren.replace(/\s/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
};
