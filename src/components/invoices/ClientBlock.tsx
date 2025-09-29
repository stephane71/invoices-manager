"use client";
import { useCallback, useEffect, useState } from "react";
import type { Client } from "@/types/models";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

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
};

export default function ClientBlock({
  clients,
  clientId,
  onSelectClientAction,
  onRequestCreateNewClientAction,
  isLoading,
}: ClientBlockProps) {
  const t = useTranslations("Invoices");

  // UI state for the inline "direct new client" form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const resetNewForm = useCallback(() => {
    setShowNewForm(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewAddress("");
  }, []);

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

    const name = newName.trim();
    if (!name) {
      return;
    }

    onRequestCreateNewClientAction({
      name,
      email: newEmail.trim() ? newEmail.trim() : undefined,
      phone: newPhone.trim() ? newPhone.trim() : undefined,
      address: newAddress.trim() ? newAddress.trim() : undefined,
    });
  }, [
    showNewForm,
    newName,
    newEmail,
    newPhone,
    newAddress,
    onRequestCreateNewClientAction,
  ]);

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
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.name")}</label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("new.form.namePlaceholder")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.email")}</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t("new.form.emailPlaceholder")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.phone")}</label>
            <Input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder={t("new.form.phonePlaceholder")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.address")}</label>
            <textarea
              className="min-h-[80px] rounded-md border p-3 bg-background"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder={t("new.form.addressPlaceholder")}
            />
          </div>

          {/* Actions: explicit create button or cancel */}

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={triggerCreateIfEligible}
              disabled={!newName.trim()}
            >
              {t("new.createClient")}
            </Button>
            <Button variant="ghost" size="lg" onClick={resetNewForm}>
              {t("new.cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
