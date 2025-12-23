import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { FieldErrors } from "@/components/clients/ClientFieldGroup";
import { ClientForm } from "@/components/clients/clients";
import { useCreateClient } from "@/hooks/mutations/useCreateClient";
import { ApiError } from "@/lib/api-client";

export class ClientCreationError extends Error {
  fieldErrors?: FieldErrors;

  constructor(message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ClientCreationError";
    this.fieldErrors = fieldErrors;
  }
}

export const useCreateNewClientFromNewInvoice = () => {
  const t = useTranslations("Invoices");
  const createClient = useCreateClient();

  return useCallback(
    async (clientData: ClientForm) => {
      try {
        const newClient = await createClient.mutateAsync(clientData);
        return newClient.id;
      } catch (error) {
        const apiError = error as ApiError;
        throw new ClientCreationError(
          apiError.message || t("new.error.clientCreateFail"),
          apiError.fields,
        );
      }
    },
    [t, createClient],
  );
};
