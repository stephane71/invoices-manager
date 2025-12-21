"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { APP_PREFIX } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const signInSchema = z.object({
  email: z.email("email.invalid"),
  password: z.string().min(6, "password.invalid"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const tValidation = useTranslations("Validation");
  const tAuth = useTranslations("Auth");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: SignInFormData) {
    setError(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) {
          throw error;
        }
      }
      router.replace(`/${APP_PREFIX}/invoices`);
      router.refresh();
    } catch (err: unknown) {
      // @ts-expect-error error type is not correct
      setError(err?.message || tAuth("error.authFailed"));
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">
        {mode === "signin" ? tAuth("signIn.title") : tAuth("signUp.title")}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {tAuth(`${mode === "signin" ? "signIn" : "signUp"}.email`)}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  icon="Mail"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? tValidation(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {tAuth(`${mode === "signin" ? "signIn" : "signUp"}.password`)}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  icon="Lock"
                  aria-invalid={fieldState.invalid}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  disabled={isSubmitting}
                  required
                />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error?.message
                      ? tValidation(fieldState.error.message)
                      : ""}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? tAuth(`${mode === "signin" ? "signIn" : "signUp"}.submitting`)
              : tAuth(`${mode === "signin" ? "signIn" : "signUp"}.submit`)}
          </Button>
        </FieldGroup>
      </form>
      <div className="mt-4 text-sm">
        {mode === "signin" ? (
          <Button variant="link" onClick={() => setMode("signup")}>
            {tAuth("signIn.switchToSignUp")}
          </Button>
        ) : (
          <Button variant="link" onClick={() => setMode("signin")}>
            {tAuth("signUp.switchToSignIn")}
          </Button>
        )}
      </div>
    </div>
  );
}
