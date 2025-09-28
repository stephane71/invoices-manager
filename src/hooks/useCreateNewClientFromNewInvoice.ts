import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Client } from "@/types/models";

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
        throw new Error(t("new.error.clientCreateFail"));
      }

      const newClient = await clientRes.json();
      return newClient.id;
    },
    [t],
  );
};
