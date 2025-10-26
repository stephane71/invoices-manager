"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ClientForm } from "@/components/clients/ClientForm";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  useEffect(() => {
    let active = true;
    fetch(`/api/clients/${id}`).then(async (r) => {
      const d = await r.json();
      if (!active) {
        return;
      }
      setForm({
        name: d.name || "",
        email: d.email || "",
        address: d.address || "",
        phone: d.phone || "",
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function save() {
    const res = await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/clients");
    }
  }

  async function remove() {
    if (!confirm(t("confirm.delete"))) {
      return;
    }
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/clients");
    }
  }

  if (loading) {
    return <div className="p-4">{c("loading")}</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{t("edit.title")}</h1>
      <ClientForm value={form} onChange={setForm}>
        <Button onClick={save}>{c("save")}</Button>
        <Button variant="destructive" onClick={remove}>
          {c("delete")}
        </Button>
      </ClientForm>
    </div>
  );
}
