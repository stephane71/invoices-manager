"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ClientForm } from "@/components/clients/ClientForm";

export default function NewClientPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  async function save() {
    setLoading(true);
    setError(null);

    try {
      // Prepare the client data, converting empty strings to undefined
      const clientData = {
        name: form.name.trim(),
        email: form.email.trim() ? form.email.trim() : undefined,
        phone: form.phone.trim() ? form.phone.trim() : undefined,
        address: form.address.trim() ? form.address.trim() : undefined,
      };

      const res = await fetch(`/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (res.ok) {
        router.push("/clients");
      } else {
        const data = await res.json();
        setError(data.error || t("new.error.createFail"));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("new.error.createFail"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>
      <ClientForm value={form} onChange={setForm} error={error}>
        <Button onClick={save} disabled={loading}>
          {loading ? c("saving") : t("new.createButton")}
        </Button>
      </ClientForm>
    </div>
  );
}
