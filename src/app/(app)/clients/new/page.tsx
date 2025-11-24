"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  ClientFieldGroup,
  type ClientFormData,
} from "@/components/clients/ClientFieldGroup";
import { clientFormSchema } from "@/lib/validation";

export default function NewClientPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: ClientFormData) {
    setError("");

    try {
      const clientData = {
        name: data.name.trim(),
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
        router.push("/clients");
      } else {
        const responseData = await res.json();

        if (responseData.fields) {
          Object.entries(responseData.fields).forEach(([key, message]) => {
            setFieldError(key as keyof ClientFormData, {
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
