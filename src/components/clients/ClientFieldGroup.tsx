import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import { ClientForm } from "@/components/clients/clients";
import {
  Field,
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
  showTypeSelector?: boolean;
}

export function ClientFieldGroup({
  control,
  disabled = false,
  children,
  showTypeSelector = true,
}: ClientFormProps) {
  const t = useTranslations("Clients");

  const clientType = useWatch({
    control,
    name: "client_type",
  });

  return (
    <FieldGroup>
      {showTypeSelector && (
        <Controller
          name="client_type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.form.clientType")}
              </FieldLabel>
              <Select
                {...field}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("new.form.selectClientType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person">
                    {t("new.form.clientTypePerson")}
                  </SelectItem>
                  <SelectItem value="company">
                    {t("new.form.clientTypeCompany")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError>
                  {fieldState.error?.message ? t(fieldState.error.message) : ""}
                </FieldError>
              )}
            </Field>
          )}
        />
      )}

      {/* Person-specific fields: firstname + lastname */}
      {clientType === "person" && (
        <>
          <Controller
            name="firstname"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("new.form.firstname")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("new.form.firstnamePlaceholder")}
                  icon="User"
                  aria-invalid={fieldState.invalid}
                  disabled={disabled}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? t(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="lastname"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("new.form.lastname")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("new.form.lastnamePlaceholder")}
                  icon="User"
                  aria-invalid={fieldState.invalid}
                  disabled={disabled}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? t(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />
        </>
      )}

      {/* Company-specific field: name */}
      {clientType === "company" && (
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.form.companyName")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder={t("new.form.companyNamePlaceholder")}
                icon="Building"
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
      )}

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

      {/* SIREN field - only for companies, required */}
      {clientType === "company" && (
        <Controller
          name="siren"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.form.siren")} <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="123 456 789"
                maxLength={11}
                icon="Building"
                aria-invalid={fieldState.invalid}
                disabled={disabled}
                required
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
      )}

      {/* TVA Number field - only for companies, optional */}
      {clientType === "company" && (
        <Controller
          name="tva_number"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("new.form.tvaNumber")}{" "}
                <span className="text-sm text-gray-500">({t("optional")})</span>
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="FR12345678901"
                icon="Building"
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
      )}

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
}
