import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { z } from "zod";
import { clientFormSchema } from "@/lib/validation";

export type ClientFormData = z.infer<typeof clientFormSchema>;

export interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ClientFormProps {
  control: Control<ClientFormData>;
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
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              className={`min-h-20 rounded-md border px-3 py-2 bg-background ${fieldState.invalid ? "border-destructive" : ""}`}
              placeholder={t("new.form.addressPlaceholder")}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
}
