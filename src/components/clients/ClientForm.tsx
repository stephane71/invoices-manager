import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ClientFormProps {
  value: ClientFormData;
  onChange: (value: ClientFormData) => void;
  error?: string;
  children?: ReactNode;
}

export function ClientForm({
  value,
  onChange,
  error = "",
  children,
}: ClientFormProps) {
  const t = useTranslations("Clients");

  return (
    <>
      <div className="grid gap-2">
        <Label>{t("new.form.name")}</Label>
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("new.form.email")}</Label>
        <Input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("new.form.phone")}</Label>
        <Input
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>{t("new.form.address")}</Label>
        <textarea
          className="min-h-20 rounded-md border px-3 py-2 bg-background"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </div>
      {children && <div className="flex gap-2">{children}</div>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </>
  );
}
