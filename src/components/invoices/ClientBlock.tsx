"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Client } from "@/types/models";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  ClientFieldGroup,
  type ClientFormData,
  type FieldErrors,
} from "@/components/clients/ClientFieldGroup";
import { clientFormSchema } from "@/lib/validation";

const FORM_DATA_DEFAULT: ClientFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export type ClientBlockProps = {
  clients: Client[];
  clientId: string;
  onSelectClientAction: (id: string) => void;
  onRequestCreateNewClientAction: (data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => void;
  isLoading: boolean;
  clientFormErrors?: FieldErrors;
  error?: string;
};

export default function ClientBlock({
  clients,
  clientId,
  onSelectClientAction,
  onRequestCreateNewClientAction,
  isLoading,
  clientFormErrors = {},
  error = "",
}: ClientBlockProps) {
  const t = useTranslations("Invoices");

  // UI state for the inline "direct new client" form
  const [showNewForm, setShowNewForm] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: FORM_DATA_DEFAULT,
  });

  const {
    control,
    reset,
    watch,
    setError: setFieldError,
    formState: { errors },
  } = form;
  const formData = watch();

  // Apply external errors from parent
  useEffect(() => {
    if (clientFormErrors) {
      Object.entries(clientFormErrors).forEach(([key, message]) => {
        if (message) {
          setFieldError(key as keyof ClientFormData, {
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
    (id: string) => {
      onSelectClientAction(id);
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

  // Trigger creation request to parent when at least the name is provided
  const triggerCreateIfEligible = useCallback(() => {
    if (!showNewForm) {
      return;
    }

    const name = formData.name.trim();
    if (!name) {
      return;
    }

    // Check for validation errors before submitting
    if (Object.keys(errors).length > 0) {
      return;
    }

    onRequestCreateNewClientAction({
      name,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
    });
  }, [showNewForm, formData, onRequestCreateNewClientAction, errors]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-[1px] rounded-md flex items-center justify-center cursor-wait">
          <span className="text-white text-sm opacity-90">
            <Spinner />
          </span>
        </div>
      )}

      <div className="mt-8 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("new.client")}
      </div>

      {/* Existing client selection */}
      <div className="grid gap-2">
        <Select value={clientId} onValueChange={handleSelect}>
          <SelectTrigger id="client-select" className="h-10 w-full">
            <SelectValue placeholder={t("new.selectClient")} />
          </SelectTrigger>
          <SelectContent>
            {clients.map((cItem) => (
              <SelectItem key={cItem.id} value={cItem.id}>
                {cItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Divider-ish spacing */}
      <div className="h-3" />

      {/* Inline new client form trigger / content */}
      {!showNewForm ? (
        <Button
          variant="outline"
          size="lg"
          onClick={revealNewForm}
          className="w-full"
        >
          {t("new.addNewClient")}
        </Button>
      ) : (
        <div className="mt-2 grid gap-2 rounded-md border p-3">
          <ClientFieldGroup control={control} disabled={isLoading}>
            <Button
              variant="secondary"
              size="lg"
              onClick={triggerCreateIfEligible}
              disabled={!formData.name.trim()}
            >
              {t("new.createClient")}
            </Button>
            <Button variant="ghost" size="lg" onClick={resetNewForm}>
              {t("new.cancel")}
            </Button>
          </ClientFieldGroup>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
