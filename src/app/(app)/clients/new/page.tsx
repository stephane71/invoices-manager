"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

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
      setError(
        e instanceof Error ? e.message : t("new.error.createFail"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("new.title")}</h1>
      <div className="grid gap-2">
        <Label>{t("new.form.name")}</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("new.form.email")}</Label>
        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.phone")}</label>
        <input
          className="h-10 rounded-md border px-3 bg-background"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">{t("new.form.address")}</label>
        <textarea
          className="min-h-20 rounded-md border px-3 py-2 bg-background"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={save} disabled={loading}>
          {loading ? c("saving") : t("new.createButton")}
        </Button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
