"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ProfileFormData, profileSchema } from "@/components/profil/profil";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { useProfile } from "@/hooks/queries/useProfile";
import { ApiError } from "@/lib/api-client";
import { formatSiret } from "@/lib/utils";

export default function ProfilPage() {
  const profilTranslate = useTranslations("Profile");
  const commonTranslate = useTranslations("Common");
  const translate = useTranslations();

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

  const { data: profile, isLoading } = useProfile();

  const updateProfile = useUpdateProfile({
    onSuccess: () => {
      setSuccess(profilTranslate("status.updated"));
      setError(null);
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      setError(apiError.message || profilTranslate("error.unknown"));
      setSuccess(null);
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        siret: profile.siret || "",
        addressStreet: profile.address_street || "",
        addressPostalCode: profile.address_postal_code || "",
        addressCity: profile.address_city || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);

    try {
      await updateProfile.mutateAsync({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        siret: data.siret,
        address_street: data.addressStreet,
        address_postal_code: data.addressPostalCode,
        address_city: data.addressCity,
      });
    } catch (e) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || profilTranslate("error.unknown"));
      }
    }
  };

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
                  disabled={isLoading || isSubmitting}
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
                  disabled={isLoading || isSubmitting}
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
                  disabled={isLoading || isSubmitting}
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
                  disabled={isLoading || isSubmitting}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\s/g, "");
                    if (cleaned.length <= 14 && /^\d*$/.test(cleaned)) {
                      field.onChange(formatSiret(cleaned));
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
                  disabled={isLoading || isSubmitting}
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
                  disabled={isLoading || isSubmitting}
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
                  disabled={isLoading || isSubmitting}
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
            <Button type="submit" disabled={isLoading || isSubmitting}>
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
