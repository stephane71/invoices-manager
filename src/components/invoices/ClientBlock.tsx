"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ClientFieldGroup,
  type FieldErrors,
} from "@/components/clients/ClientFieldGroup";
import { ClientForm, clientFormSchema } from "@/components/clients/clients";
import { SelectionSheet } from "@/components/invoices/SelectionSheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Client } from "@/types/models";

const FORM_DATA_DEFAULT: ClientForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export type ClientBlockProps = {
  clients: Client[];
  clientId: string;
  onSelectClientAction: (id: string) => void;
  onRequestCreateNewClientAction: (data: ClientForm) => void;
  isLoading: boolean;
  clientFormErrors?: FieldErrors;
};

export default function ClientBlock({
  clients,
  clientId,
  onSelectClientAction,
  onRequestCreateNewClientAction,
  isLoading,
  clientFormErrors = {},
}: ClientBlockProps) {
  const t = useTranslations("Invoices");

  // UI state for the sheet and inline "direct new client" form
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const form = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: FORM_DATA_DEFAULT,
  });

  const { control, reset, handleSubmit, setError: setFieldError } = form;

  // Apply external errors from parent
  useEffect(() => {
    if (clientFormErrors) {
      Object.entries(clientFormErrors).forEach(([key, message]) => {
        if (message) {
          setFieldError(key as keyof ClientForm, {
            type: "server",
            message,
          });
        }
      });
    }
  }, [clientFormErrors, setFieldError]);

  const resetNewForm = useCallback(() => {
    setShowNewForm(false);
    reset(FORM_DATA_DEFAULT);
  }, [reset]);

  // When user selects an existing client, collapse and reset the direct-new form
  const handleSelect = useCallback(
    (client: Client) => {
      onSelectClientAction(client.id);
      if (showNewForm) {
        resetNewForm();
      }
    },
    [onSelectClientAction, resetNewForm, showNewForm],
  );

  // When revealing the new client form, clear any selected existing client
  const revealNewForm = () => {
    setShowNewForm(true);
    if (clientId) {
      onSelectClientAction("");
    }
  };

  // Close and reset the inline form once a client gets selected/created by parent
  useEffect(() => {
    if (showNewForm && clientId) {
      resetNewForm();
    }
  }, [clientId, showNewForm, resetNewForm]);

  const onSubmit = useCallback(
    (data: ClientForm) => {
      if (!showNewForm) {
        return;
      }

      const name = data.name.trim();
      if (!name) {
        return;
      }

      onRequestCreateNewClientAction({
        name,
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
      });
    },
    [showNewForm, onRequestCreateNewClientAction],
  );

  // Get selected client display text
  const selectedClient = clients.find((c) => c.id === clientId);
  const displayText = selectedClient
    ? selectedClient.name
    : t("new.selectClientPlaceholder");

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex cursor-wait items-center justify-center rounded-md bg-black/30 backdrop-blur-[1px]">
          <span className="text-sm text-white opacity-90">
            <Spinner />
          </span>
        </div>
      )}

      {/* Client selection CTA - styled as input */}
      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={selectedClient ? "" : "text-muted-foreground"}>
            {displayText}
          </span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>
      </div>

      {/* Client Selection Sheet */}
      <SelectionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={t("new.client")}
        searchPlaceholder={t("new.searchClientsPlaceholder")}
        noResultsMessage={t("new.noClientsFound")}
        items={clients}
        getItemKey={(client) => client.id}
        filterItem={(client, query) =>
          client.name.toLowerCase().includes(query)
        }
        onSelect={handleSelect}
        renderItem={(client, onSelect) => (
          <button
            type="button"
            onClick={onSelect}
            className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-accent"
          >
            <div className="font-medium">{client.name}</div>
            {client.email && (
              <div className="text-sm text-muted-foreground">
                {client.email}
              </div>
            )}
          </button>
        )}
      />

      {/* Divider-ish spacing */}
      <div className="h-3" />

      {/* Inline new client form trigger / content */}
      {!showNewForm ? (
        <Button
          variant="secondary"
          size="lg"
          onClick={revealNewForm}
          className="w-full"
        >
          {t("new.addNewClient")}
        </Button>
      ) : (
        <div className="mt-2 grid gap-2 rounded-md border p-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ClientFieldGroup control={control} disabled={isLoading}>
              <Button variant="secondary" size="lg" type="submit">
                {t("new.createClient")}
              </Button>
              <Button variant="ghost" size="lg" onClick={resetNewForm}>
                {t("new.cancel")}
              </Button>
            </ClientFieldGroup>
          </form>
        </div>
      )}
    </div>
  );
}
