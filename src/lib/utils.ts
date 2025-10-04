import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_LOCALE, PRICE_PRECISION } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
