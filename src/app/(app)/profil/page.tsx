"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isValidPhoneNumber } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(1, "Validation.name.required"),
  email: z.email("Validation.email.invalid"),
  phone: z
    .string()
    .refine(
      (val) => isValidPhoneNumber(val, { isOptional: true }),
      "Validation.phone.invalid",
    ),
  siret: z
    .string()
    .min(1, "Validation.siret.required")
    .refine(
      (val) => /^\d{14}$/.test(val.replace(/\s/g, "")),
      "Validation.siret.invalid",
    ),
  addressStreet: z.string().min(1, "Validation.addressStreet.required"),
  addressPostalCode: z.string().min(1, "Validation.addressPostalCode.required"),
  addressCity: z.string().min(1, "Validation.addressCity.required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilPage() {
  const profilTranslate = useTranslations("Profile");
  const commonTranslate = useTranslations("Common");
  const translate = useTranslations();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      siret: "",
      addressStreet: "",
      addressPostalCode: "",
      addressCity: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(
            profilTranslate("error.load", { status: res.status }),
          );
        }
        const json = await res.json();
        const p = json?.data;
        if (p && !cancelled) {
          reset({
            fullName: p.full_name || "",
            email: p.email || "",
            phone: p.phone || "",
            siret: p.siret || "",
            addressStreet: p.address_street || "",
            addressPostalCode: p.address_postal_code || "",
            addressCity: p.address_city || "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : profilTranslate("error.unknown"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [profilTranslate, reset]);

  async function onSubmit(data: ProfileFormData) {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          siret: data.siret,
          address_street: data.addressStreet,
          address_postal_code: data.addressPostalCode,
          address_city: data.addressCity,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: null }));
        throw new Error(
          json.error || profilTranslate("error.save", { status: res.status }),
        );
      }
      setSuccess(profilTranslate("status.updated"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : profilTranslate("error.unknown"),
      );
    }
  }

  return (
    <div className="max-w-2xl space-y-6 p-4">
      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-600" role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Full name */}
          <Controller
            name="fullName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.fullName")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={profilTranslate("form.fullNamePlaceholder")}
                  icon="User"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.email")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder={profilTranslate("form.emailPlaceholder")}
                  icon="Mail"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.phone")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  placeholder={profilTranslate("form.phonePlaceholder")}
                  icon="Phone"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* SIRET */}
          <Controller
            name="siret"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.siret")}{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="123 456 789 00012"
                  maxLength={17}
                  icon="Building"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\s/g, "");
                    if (cleaned.length <= 14 && /^\d*$/.test(cleaned)) {
                      const formatted = cleaned.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{0,5})/,
                        (_, p1, p2, p3, p4) => {
                          let result = p1;
                          if (p2) result += ` ${p2}`;
                          if (p3) result += ` ${p3}`;
                          if (p4) result += ` ${p4}`;
                          return result;
                        },
                      );
                      field.onChange(formatted.trim());
                    }
                  }}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Address Street */}
          <Controller
            name="addressStreet"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.addressStreet")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={profilTranslate("form.addressStreetPlaceholder")}
                  icon="MapPin"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Address Postal Code */}
          <Controller
            name="addressPostalCode"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.addressPostalCode")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={profilTranslate(
                    "form.addressPostalCodePlaceholder",
                  )}
                  icon="Hash"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {/* Address City */}
          <Controller
            name="addressCity"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {profilTranslate("form.addressCity")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={profilTranslate("form.addressCityPlaceholder")}
                  icon="Building"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? translate(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <div className="pt-2">
            <Button type="submit" disabled={loading || isSubmitting}>
              {isSubmitting
                ? commonTranslate("saving")
                : commonTranslate("save")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
