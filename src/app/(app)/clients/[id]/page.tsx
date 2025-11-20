"use client";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  ClientForm,
  type ClientFormData,
  type FieldErrors,
} from "@/components/clients/ClientForm";
import { clientSchema } from "@/lib/validation";
import { getZodFieldErrors } from "@/lib/utils";

const ERROR_DEFAULT = "";

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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(ERROR_DEFAULT);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();
  const t = useTranslations("Clients");
  const c = useTranslations("Common");

  const validateForm = useCallback(
    (data: ClientFormData) => {
      const result = clientSchema.safeParse({
        name: data.name.trim(),
        email: data.email.trim() || undefined,
        phone: data.phone.trim() || undefined,
        address: data.address.trim() || undefined,
      });

      if (!result.success) {
        setFieldErrors(getZodFieldErrors<FieldErrors>(result.error));
      } else {
        setFieldErrors({});
      }
    },
    [setFieldErrors],
  );

  const handleFormChange = useCallback(
    (data: ClientFormData) => {
      setForm(data);
      validateForm(data);
    },
    [validateForm],
  );

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
    setSaving(true);
    setError(ERROR_DEFAULT);
    setFieldErrors({});

    try {
      // Prepare the client data, converting empty strings to undefined
      const clientData = {
        name: form.name.trim(),
        email: form.email.trim() ? form.email.trim() : undefined,
        phone: form.phone.trim() ? form.phone.trim() : undefined,
        address: form.address.trim() ? form.address.trim() : undefined,
      };

      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (res.ok) {
        router.push("/clients");
      } else {
        const data = await res.json();

        // If the API returns field-specific errors, use them
        if (data.fields) {
          setFieldErrors(data.fields);
        } else {
          setError(data.error || t("new.error.createFail"));
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("new.error.createFail"));
    } finally {
      setSaving(false);
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
      <ClientForm
        value={form}
        onChange={handleFormChange}
        error={error}
        fieldErrors={fieldErrors}
      >
        <Button onClick={save} disabled={saving}>
          {saving ? c("saving") : c("save")}
        </Button>
        <Button variant="destructive" onClick={remove} disabled={saving}>
          {c("delete")}
        </Button>
      </ClientForm>
    </div>
  );
}
