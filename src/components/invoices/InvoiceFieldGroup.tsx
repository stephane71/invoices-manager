import { useTranslations } from "next-intl";
import { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { InvoiceForm } from "@/components/invoices/invoices";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface InvoiceFieldGroupProps {
  control: Control<InvoiceForm>;
}

const STANDARD_VAT_EXEMPTION = "TVA non applicable, art. 293 B du CGI";

export const InvoiceFieldGroup = ({ control }: InvoiceFieldGroupProps) => {
  const t = useTranslations("Invoices");
  const [useStandardVatExemption, setUseStandardVatExemption] = useState(false);

  return (
    <FieldGroup>
      <Controller
        name="number"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.number")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              icon="FileText"
              placeholder={t("new.numberPlaceholder")}
              aria-invalid={fieldState.invalid}
              required
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="issueDate"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>{t("new.issueDate")}</FieldLabel>
            <Input {...field} id={field.name} type="date" icon="Calendar" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="operationType"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.operationType")} <span className="text-red-500">*</span>
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("new.selectOperationType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="services">
                  {t("new.operationTypeServices")}
                </SelectItem>
                <SelectItem value="goods">
                  {t("new.operationTypeGoods")}
                </SelectItem>
                <SelectItem value="mixed">
                  {t("new.operationTypeMixed")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              {t("new.operationTypeDescription")}
            </FieldDescription>
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      <Controller
        name="vatExemptionMention"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.vatExemptionMention")}
            </FieldLabel>

            <div className="flex items-center gap-3 mb-3">
              <Switch
                id="vat-exemption-switch"
                checked={useStandardVatExemption}
                onCheckedChange={(checked) => {
                  setUseStandardVatExemption(checked);
                  if (checked) {
                    field.onChange(STANDARD_VAT_EXEMPTION);
                  } else {
                    field.onChange("");
                  }
                }}
              />
              <label
                htmlFor="vat-exemption-switch"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {t("new.useStandardVatExemption")}
              </label>
            </div>

            <Input
              {...field}
              id={field.name}
              placeholder="TVA non applicable, art. 293 B du CGI"
              aria-invalid={fieldState.invalid}
              disabled={useStandardVatExemption}
            />
            <FieldDescription>
              {t("new.vatExemptionDescription")}
            </FieldDescription>
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
};
