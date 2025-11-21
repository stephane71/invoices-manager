"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useTranslations } from "next-intl";
import { isValidPhoneNumber } from "libphonenumber-js";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(
    (val) => !val || isValidPhoneNumber(val),
    "Invalid phone number"
  ),
  address: z.string().min(1, "Address is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilPage() {
  const t = useTranslations("Profile");
  const c = useTranslations("Common");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(t("error.load", { status: res.status }));
        }
        const json = await res.json();
        const p = json?.data;
        if (p && !cancelled) {
          reset({
            fullName: p.full_name || "",
            email: p.email || "",
            phone: p.phone || "",
            address: p.address || "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t("error.unknown"));
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
  }, [t, reset]);

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
          address: data.address,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: null }));
        throw new Error(json.error || t("error.save", { status: res.status }));
      }
      setSuccess(t("status.updated"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error.unknown"));
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

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
                <FieldLabel htmlFor={field.name}>{t("form.fullName")}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("form.fullNamePlaceholder")}
                  icon="User"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("form.email")}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  icon="Mail"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("form.phone")}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  placeholder={t("form.phonePlaceholder")}
                  icon="Phone"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Address */}
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("form.address")}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder={t("form.addressPlaceholder")}
                  icon="MapPin"
                  aria-invalid={fieldState.invalid}
                  disabled={loading || isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="pt-2">
            <Button type="submit" disabled={loading || isSubmitting}>
              {isSubmitting ? c("saving") : c("save")}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
