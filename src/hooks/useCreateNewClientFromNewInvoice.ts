import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Client } from "@/types/models";
import type { FieldErrors } from "@/components/clients/ClientFieldGroup";

export class ClientCreationError extends Error {
  fieldErrors?: FieldErrors;

  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ClientCreationError";
    this.fieldErrors = fieldErrors;
  }
}

export const useCreateNewClientFromNewInvoice = ({}) => {
  const t = useTranslations("Invoices");

  return useCallback(
    async (clientData: Omit<Client, "id" | "created_at">) => {
      const clientRes = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (!clientRes.ok) {
        const errorData = await clientRes.json();
        throw new ClientCreationError(
          errorData.error || t("new.error.clientCreateFail"),
          errorData.fields,
        );
      }

      const newClient = await clientRes.json();
      return newClient.id;
    },
    [t],
  );
};
