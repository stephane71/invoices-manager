"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClientFieldGroup } from "@/components/clients/ClientFieldGroup";
import {
  CLIENT_FORM_PERSON_DEFAULT,
  ClientForm,
  clientFormSchema,
} from "@/components/clients/clients";
import { Button } from "@/components/ui/button";

export default function NewClientPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: CLIENT_FORM_PERSON_DEFAULT,
  });

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting },
    // reset,
  } = form;

  // const clientType = useWatch({
  //   control,
  //   name: "client_type",
  // });

  // useEffect(() => {
  //   if (clientType === "company") {
  //     reset(CLIENT_FORM_COMPANY_DEFAULT);
  //   } else if (clientType === "person") {
  //     reset(CLIENT_FORM_PERSON_DEFAULT);
  //   }
  // }, [clientType, reset]);

  async function onSubmit(data: ClientForm) {
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

      const res = await fetch(`/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (res.ok) {
        router.push("/app/clients");
      } else {
        const responseData = await res.json();

        if (responseData.fields) {
          Object.entries(responseData.fields).forEach(([key, message]) => {
            setFieldError(key as keyof ClientForm, {
              type: "server",
              message: message as string,
            });
          });
        } else {
          setError(responseData.error || t("new.error.createFail"));
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("new.error.createFail"));
    }
  }

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
