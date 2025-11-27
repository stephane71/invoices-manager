import { useTranslations } from "next-intl";
import { Control, Controller } from "react-hook-form";
import { IbanBicForm } from "@/components/invoices/iban/schemas";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface IbanFieldGroupProps {
  control: Control<IbanBicForm>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const IbanFieldGroup = ({
  control,
  isSubmitting,
  onCancel,
}: IbanFieldGroupProps) => {
  const t = useTranslations("Invoices");
  const c = useTranslations("Common");

  return (
    <FieldGroup>
      {/* IBAN */}
      <Controller
        name="paymentIban"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.payment.iban.paymentIban")}
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder={t("new.payment.iban.paymentIbanPlaceholder")}
              icon="CreditCard"
              aria-invalid={fieldState.invalid}
              disabled={isSubmitting}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message || ""}</FieldError>
            )}
          </Field>
        )}
      />

      {/* BIC */}
      <Controller
        name="paymentBic"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.payment.iban.paymentBic")}
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder={t("new.payment.iban.paymentBicPlaceholder")}
              icon="Building"
              aria-invalid={fieldState.invalid}
              disabled={isSubmitting}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message || ""}</FieldError>
            )}
          </Field>
        )}
      />

      <p className="text-xs text-muted-foreground">
        {t("new.payment.iban.paymentHelp")}
      </p>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {c("cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? c("saving") : c("save")}
        </Button>
      </div>
    </FieldGroup>
  );
};
