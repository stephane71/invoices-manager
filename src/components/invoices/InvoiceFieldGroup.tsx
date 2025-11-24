import { Control, Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InvoiceForm } from "@/components/invoices/invoices";
import { useTranslations } from "next-intl";

interface InvoiceFieldGroupProps {
  control: Control<InvoiceForm>;
}

export const InvoiceFieldGroup = ({ control }: InvoiceFieldGroupProps) => {
  const t = useTranslations("Invoices");

  return (
    <FieldGroup>
      <Controller
        name="number"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="number">{t("new.number")}</FieldLabel>
            <Input
              {...field}
              type="text"
              icon="FileText"
              placeholder={t("new.numberPlaceholder")}
              required
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="issueDate"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="issueDate">{t("new.issueDate")}</FieldLabel>
            <Input {...field} id="issueDate" type="date" icon="Calendar" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};
