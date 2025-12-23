"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClientFieldGroup } from "@/components/clients/ClientFieldGroup";
import {
  CLIENT_FORM_COMPANY_DEFAULT,
  CLIENT_FORM_PERSON_DEFAULT,
  ClientForm,
  clientFormSchema,
} from "@/components/clients/clients";
import { Button } from "@/components/ui/button";
import { useCreateClient } from "@/hooks/mutations/useCreateClient";
import { ApiError } from "@/lib/api-client";
import { APP_PREFIX } from "@/lib/constants";

export default function NewClientPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      ...CLIENT_FORM_COMPANY_DEFAULT,
      ...CLIENT_FORM_PERSON_DEFAULT,
    } as ClientForm,
  });

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting },
  } = form;

  const createClient = useCreateClient({
    onSuccess: () => {
      router.push(`/${APP_PREFIX}/clients`);
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      if (apiError.fields) {
        Object.entries(apiError.fields).forEach(([key, message]) => {
          setFieldError(key as keyof ClientForm, {
            type: "server",
            message: message as string,
          });
        });
      } else {
        setError(apiError.message || t("new.error.createFail"));
      }
    },
  });

  const onSubmit = async (data: ClientForm) => {
    setError("");

    try {
      // Build client data based on client type using discriminated union
      const clientData =
        data.client_type === "person"
          ? {
              client_type: "person" as const,
              firstname: data.firstname.trim(),
              lastname: data.lastname.trim(),
              email: data.email.trim() || undefined,
              phone: data.phone.trim() || undefined,
              address: data.address.trim() || undefined,
            }
          : {
              client_type: "company" as const,
              name: data.name.trim(),
              siren: data.siren.trim(),
              tva_number: data.tva_number?.trim() || undefined,
              email: data.email.trim() || undefined,
              phone: data.phone.trim() || undefined,
              address: data.address.trim() || undefined,
            };

      await createClient.mutateAsync(clientData);
    } catch (e: unknown) {
      // Error handling is done in the mutation's onError callback
      // This catch is for any unexpected errors
      if (e instanceof Error && !error) {
        setError(e.message || t("new.error.createFail"));
      }
    }
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClientFieldGroup control={control} disabled={isSubmitting}>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? c("saving") : t("new.createButton")}
          </Button>
        </ClientFieldGroup>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
