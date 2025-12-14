import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { ClientForm } from "@/components/clients/clients";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatSiren } from "@/lib/utils";

export interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ClientFormProps {
  control: Control<ClientForm>;
  disabled?: boolean;
  children?: ReactNode;
}

export function ClientFieldGroup({
  control,
  disabled = false,
  children,
}: ClientFormProps) {
  const t = useTranslations("Clients");

  return (
    <FieldGroup>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.form.name")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder={t("new.form.namePlaceholder")}
              icon="User"
              aria-invalid={fieldState.invalid}
              disabled={disabled}
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
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.form.email")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              placeholder={t("new.form.emailPlaceholder")}
              icon="Mail"
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

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("new.form.phone")}</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="tel"
              placeholder={t("new.form.phonePlaceholder")}
              icon="Phone"
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

      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.form.address")}
            </FieldLabel>
            <textarea
              {...field}
              id={field.name}
              className="bg-background min-h-20 rounded-md border px-3 py-2"
              placeholder={t("new.form.addressPlaceholder")}
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

      <Controller
        name="siren"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("new.form.siren")}{" "}
              <span className="text-sm text-gray-500">({t("optional")})</span>
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              placeholder="123 456 789"
              maxLength={11}
              icon="Building"
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\s/g, "");
                if (cleaned.length <= 9 && /^\d*$/.test(cleaned)) {
                  field.onChange(formatSiren(cleaned));
                }
              }}
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
}
