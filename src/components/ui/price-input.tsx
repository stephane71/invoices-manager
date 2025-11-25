"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { centsToCurrency, parsePrice } from "@/lib/utils";

export interface PriceInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "type"
  > {
  /**
   * Price value in cents (integer)
   */
  value: number;
  /**
   * Callback when price changes (value in cents)
   */
  onChange: (cents: number) => void;
  /**
   * Currency symbol to display (default: €)
   */
  currency?: string;
  /**
   * Locale for formatting (default: fr-FR)
   */
  locale?: string;
}

/**
 * PriceInput component for handling monetary values
 *
 * Features:
 * - Displays value with 2 decimals
 * - Adds trailing zeros if needed (12,3 → 12,30)
 * - Includes currency symbol
 * - Supports thousand separators based on locale
 * - Uses inputMode="decimal" for mobile keyboards
 * - Stores value as integer (cents) to avoid floating-point issues
 * - Prevents negative values (minimum: 0)
 */
export function PriceInput({
  value,
  onChange,
  currency = "€",
  locale = "fr-FR",
  className,
  onBlur,
  ...props
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  // Format value for display
  const formatDisplay = React.useCallback(
    (cents: number, focused: boolean): string => {
      const currencyValue = centsToCurrency(cents);

      if (focused) {
        // When focused, show plain number with 2 decimals
        return currencyValue.toFixed(2).replace(".", ",");
      } else {
        // When blurred, show formatted with thousand separators
        return currencyValue.toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    },
    [locale],
  );

  // Update display when value prop changes
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDisplay(value, false));
    }
  }, [value, isFocused, formatDisplay]);

  // Initialize display value
  React.useEffect(() => {
    setDisplayValue(formatDisplay(value, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse and update the value in cents
    const cents = parsePrice(input);
    onChange(cents);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDisplayValue(formatDisplay(value, true));
    // Select all text on focus for easy editing
    e.target.select();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setDisplayValue(formatDisplay(value, false));
    onBlur?.(e);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        className={className}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ paddingRight: "2rem" }}
        {...props}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        {currency}
      </span>
    </div>
  );
}
