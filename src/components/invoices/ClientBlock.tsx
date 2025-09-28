"use client";
import { useCallback, useEffect, useState } from "react";
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

export type ClientBlockProps = {
  clients: Client[];
  clientId: string;
  onSelectClientAction: (id: string) => void;
};

export default function ClientBlock({
  clients,
  clientId,
  onSelectClientAction,
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

  // If parent clears clientId externally, we don't force any change here
  useEffect(() => {
    // no-op; kept for future synchronization if needed
  }, [clientId]);

  return (
    <div>
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
        <Button variant="outline" size="sm" onClick={revealNewForm}>
          {t("new.addNewClient")}
        </Button>
      ) : (
        <div className="mt-2 grid gap-2 rounded-md border p-3">
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.name")}</label>
            <input
              type="text"
              className="h-10 rounded-md border px-3 bg-background"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("new.form.namePlaceholder")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.email")}</label>
            <input
              type="email"
              className="h-10 rounded-md border px-3 bg-background"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={t("new.form.emailPlaceholder")}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm">{t("new.form.phone")}</label>
            <input
              type="tel"
              className="h-10 rounded-md border px-3 bg-background"
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

          {/* No confirm button here: validated by the page validation button later */}

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetNewForm}>
              {t("new.cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
