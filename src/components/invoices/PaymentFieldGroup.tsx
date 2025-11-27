import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { InvoiceForm } from "@/components/invoices/invoices";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PaymentFieldGroupProps {
  control: Control<InvoiceForm>;
  disabled?: boolean;
  children?: ReactNode;
}

export const PaymentFieldGroup = ({
  control,
  disabled = false,
  children,
}: PaymentFieldGroupProps) => {
  const t = useTranslations("Invoices");

  return (
    <FieldGroup>
      <div className="space-y-4">
        {/* Payment Link */}
        <Controller
          name="paymentLink"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.payment.link")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="url"
                placeholder={t("new.payment.linkPlaceholder")}
                icon="Link"
                aria-invalid={fieldState.invalid}
                disabled={disabled}
              />
              {fieldState.invalid && (
                <FieldError>
                  {fieldState.error?.message ? t(fieldState.error.message) : ""}
                </FieldError>
              )}
            </Field>
          )}
        />

        {/* Free Text */}
        <Controller
          name="paymentFreeText"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.payment.freeText")}
              </FieldLabel>
              <textarea
                {...field}
                id={field.name}
                className={`min-h-20 rounded-md border px-3 py-2 bg-background ${fieldState.invalid ? "border-destructive" : ""}`}
                placeholder={t("new.payment.freeTextPlaceholder")}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
              />
              {fieldState.invalid && (
                <FieldError>
                  {fieldState.error?.message ? t(fieldState.error.message) : ""}
                </FieldError>
              )}
            </Field>
          )}
        />
      </div>

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
};
