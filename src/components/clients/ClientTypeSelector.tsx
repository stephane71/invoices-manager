import { Building2, User } from "lucide-react";
import { useTranslations } from "next-intl";

export type ClientTypeSelectorProps = {
  value: "person" | "company";
  onChange: (value: "person" | "company") => void;
};

export const ClientTypeSelector = ({
  value,
  onChange,
}: ClientTypeSelectorProps) => {
  const t = useTranslations("Clients");

  return (
    <div className="bg-muted inline-flex rounded-full p-1">
      <button
        type="button"
        onClick={() => onChange("person")}
        className={`flex grow items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
          value === "person"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="size-4" />
        <span>{t("new.form.clientTypePerson")}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("company")}
        className={`flex grow items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
          value === "company"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Building2 className="size-4" />
        <span>{t("new.form.clientTypeCompany")}</span>
      </button>
    </div>
  );
};
